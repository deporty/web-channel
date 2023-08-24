import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Id, TeamEntity } from '@deporty-org/entities';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, zip } from 'rxjs';
import { debounceTime, filter, first, map } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getStageIndicator,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import {
  selectTeamById,
  selectTeamWithMembersById,
} from 'src/app/features/teams/state-management/teams.selectors';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import {
  CreateNodeMatchCommand,
  EditNodeMatchCommand,
  GetMainDrawByTournamentCommand,
} from '../../../state-management/main-draw/main-draw.commands';
import {
  selectMainDrawByTournamentId,
  selectTransactionById,
} from '../../../state-management/main-draw/main-draw.selector';
import { EditNodeMatchComponent } from '../../pages/edit-node-match/edit-node-match.component';
import { MatchVisualizationComponent } from '../match-visualization/match-visualization.component';
import {
  GraficalDuplexGeneratedNode,
  GraficalNode,
  TreeNode,
  createTree,
  getParentKey,
} from './tree-creator';
import { AddNodeMatchComponent } from '../../pages/add-node-match/add-node-match.component';
import { TransactionResolvedEvent } from '../../../state-management/main-draw/main-draw.events';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-draw',
  templateUrl: './main-draw.component.html',
  styleUrls: ['./main-draw.component.scss'],
})
export class MainDrawComponent implements OnInit, AfterViewInit {
  $nodeMatches!: Observable<NodeMatchEntity[] | undefined>;
  @ViewChild('draw') container!: ElementRef;
  currentMatches!: NodeMatchEntity[];
  getStageIndicator = getStageIndicator;
  length = 0;
  nodeMatches!: Array<NodeMatchEntity>;
  @Output('on-exist-data') onExistData: EventEmitter<boolean>;
  pageSize = 2;
  pageSizeOptions: number[] = [2];
  paginatedMatches!: NodeMatchEntity[][];
  simpleChartNodeRoot: any;

  sortedNodeMatches: NodeMatchEntity[];
  sortedNodeMatchesOriginal: Array<NodeMatchEntity>;

  selectTransactionByIdSubscription!: Subscription;

  @Input('tournament-id') tournamentId!: Id;
  tree!: TreeNode[];

  constructor(
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.onExistData = new EventEmitter<boolean>();
    this.sortedNodeMatchesOriginal = [];
    this.sortedNodeMatches = [];
    this.simpleChartNodeRoot = {
      text: {
        name: '',
      },
    };
  }

  editNodeMatch(nodeMatch: NodeMatchEntity) {
    this.dialog.open(EditNodeMatchComponent, {
      data: {
        nodeMatch,
        tournamentId: this.tournamentId,
      },
      height: 'fit-content',
      maxHeight: '80vh',
      width: '90vw',
    });
  }

  async generateVisualNodeFromName(id: string): Promise<TeamEntity> {
    return await this.store
      .select(selectTeamById(id))
      .pipe(
        first((x) => {
          return !!x;
        })
      )
      .toPromise();
  }

  isAllowedToEditMatch() {
    const identifier = 'edit-match-in-group';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  makePagination() {
    if (this.sortedNodeMatches) {
      this.currentMatches = [];

      this.length = this.sortedNodeMatches.length;
      let i = 1;
      this.paginatedMatches = [];
      let temp = [];

      for (const match of this.sortedNodeMatches) {
        temp.push(match);
        if (i == this.pageSize) {
          this.paginatedMatches.push([...temp]);
          i = 0;
          temp = [];
        }
        i++;
      }
      if (temp.length > 0) {
        this.paginatedMatches.push([...temp]);
      }
      if (this.paginatedMatches.length > 0) {
        this.currentMatches = this.paginatedMatches[0];
      }
    }
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.nodeMatches = [];
    this.store.dispatch(
      GetMainDrawByTournamentCommand({
        tournamentId: this.tournamentId,
      })
    );
    this.$nodeMatches = this.store
      .select(selectMainDrawByTournamentId(this.tournamentId))
      .pipe(
        filter((data) => {
          return JSON.stringify(data) != JSON.stringify(this.nodeMatches);
        }),
        debounceTime(500)
      );

    this.$nodeMatches.subscribe(async (data) => {
      if (data) {
        console.log('Martin ', data);

        this.onExistData.emit(data.length > 0);
        this.nodeMatches = data;

        this.sortNodeMatches(this.nodeMatches);
        this.sortedNodeMatches = [...this.sortedNodeMatchesOriginal].sort(
          (prev, curre) => {
            return prev.level <= curre.level ? -1 : 1;
          }
        );
        this.makePagination();
        if (this.paginatedMatches.length > 0) {
          this.onPage(0);
        }

        console.log('sorted ', this.sortedNodeMatchesOriginal);

        const maxLevel = this.sortedNodeMatchesOriginal[0]?.level;
        if (maxLevel !== undefined) {
          console.log(7, this.sortedNodeMatchesOriginal);
          const x = await this.vegeta([...this.sortedNodeMatchesOriginal]);
          // .then((x) => {
            const y = [...x];
            console.log(55, y);

          createTree(0, 0, y, maxLevel);

          if (y) {
            this.tree = JSON.parse(JSON.stringify(y));
            console.log(y);
          }
          // });
        }
      }
    });
  }

  onPage(event: number) {
    this.currentMatches = this.paginatedMatches[event];
  }

  addNodeMatch() {
    const teamIds = this.nodeMatches.reduce(
      (prev: Array<string>, curr: NodeMatchEntity) => {
        prev.push(curr.match.teamAId);
        prev.push(curr.match.teamBId);
        return prev;
      },
      []
    );
    const filteredTeamIds = Array.from(new Set(teamIds));
    const dialog = this.dialog.open(AddNodeMatchComponent, {
      data: {
        teams:
          filteredTeamIds.length > 0
            ? zip(
                ...filteredTeamIds.map((t) =>
                  this.store
                    .select(selectTeamWithMembersById(t))
                    .pipe(map((x) => x.team))
                )
              )
            : of([]),
        tournamentId: this.tournamentId,
      },
      maxHeight: '80vh',
      height: 'fit-content',
    });
    dialog.afterClosed().subscribe((data) => {
      console.log(data);

      const nodeMatch: NodeMatchEntity = {
        key: data.key,
        level: data.level,
        match: {
          status: 'editing',
          teamAId: data.teamA.id,
          teamBId: data.teamB.id,
        },
        tournamentId: this.tournamentId,
      };

      const transactionId = getTransactionIdentifier(nodeMatch);

      this.store.dispatch(
        CreateNodeMatchCommand({
          nodeMatch: nodeMatch,
          transactionId,
        })
      );

      this.selectTransactionByIdSubscription = admingPopUpInComponent({
        dialog: this.dialog,
        store: this.store,
        TransactionDeletedEvent: TransactionResolvedEvent,
        selectTransactionById: selectTransactionById,
        transactionId,
        translateService: this.translateService,
      });
    });
  }
  onViewMatch(data: any) {
    this.dialog.open(MatchVisualizationComponent, {
      data: {
        ...data,
        tournamentId: this.tournamentId,
      },
      minHeight: '80vh',
    });
  }

  async vegeta(nodeMatchesList: Array<NodeMatchEntity>): Promise<TreeNode[]> {
    const response: TreeNode[] = [];

    for (const nodeMatch of nodeMatchesList) {
      const teamA = await this.generateVisualNodeFromName(
        nodeMatch.match.teamAId
      );
      const teamB = await this.generateVisualNodeFromName(
        nodeMatch.match.teamBId
      );
      response.push({
        k: nodeMatch.key,
        key: `K${nodeMatch.key}L${nodeMatch.level}`,
        level: nodeMatch.level,
        parent: getParentKey(nodeMatch.key, nodeMatch.level),
        shieldA: teamA.miniShield || '../assets/badge-team.png',
        shieldB: teamB.miniShield || '../assets/badge-team.png',
        stroke: getStageIndicator(nodeMatch.level).background,
        teamA: teamA.name,
        teamB: teamB.name,
      });
    }
    return response;
  }

  private sortNodeMatches(nodeMatches: NodeMatchEntity[]) {
    this.sortedNodeMatchesOriginal = [...nodeMatches]
      .sort((prev, curre) => {
        if (prev.level > curre.level) {
          return -1;
        } else if (prev.level === curre.level) {
          if (prev.key > curre.key) {
            return -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      })
      .filter((c) => {
        return c.key !== -1;
      });
  }
}
