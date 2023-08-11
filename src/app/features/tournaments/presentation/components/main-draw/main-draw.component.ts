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
import { ActivatedRoute, Router } from '@angular/router';
import { Id, TeamEntity } from '@deporty-org/entities';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { getStageIndicator } from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { selectMainDrawByTournamentId } from '../../../state-management/main-draw/main-draw.selector';
import { EditNodeMatchComponent } from '../../pages/edit-node-match/edit-match.component';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatchVisualizationComponent } from '../match-visualization/match-visualization.component';
import { GetMainDrawByTournamentCommand } from '../../../state-management/main-draw/main-draw.commands';
import {
  GraficalNode,
  GraficalDuplexGeneratedNode,
  GraficalNodeLevel,
  createTree,
  TreeNode,
  getParentKey,
} from './tree-creator';

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
  simple_chart_config: any = {
    chart: {
      container: '#tree-simple',
      rootOrientation: 'EAST',
      connectors: {
        type: 'step',
      },
    },
  };
  sortedNodeMatches: NodeMatchEntity[];
  sortedNodeMatchesOriginal: Array<NodeMatchEntity>;
  @Input('tournament-id') tournamentId!: Id;
  tree!: TreeNode[];

  constructor(
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    public dialog: MatDialog
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

  addLastNode(lastTree: GraficalDuplexGeneratedNode): GraficalNode {
    return {
      text: {
        name: '',
      },
      children: [lastTree.node1, lastTree.node2],
    };
  }

  editNodeMatch(item: any) {
    this.router.navigate([EditNodeMatchComponent.route], {
      queryParams: {
        tournamentId: this.tournamentId,
        nodeMatchId: item.id,
        locations: JSON.stringify([]),
      },
      relativeTo: this.activatedRoute,
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
    const identifier = 'tournaments:edit-match:ui';
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

  ngOnInit(): void {
    this.store.dispatch(
      GetMainDrawByTournamentCommand({
        tournamentId: this.tournamentId,
      })
    );
    this.$nodeMatches = this.store.select(
      selectMainDrawByTournamentId(this.tournamentId)
    );

    this.$nodeMatches.subscribe((data) => {
      if (data) {
        this.onExistData.emit(data.length > 0);
        this.nodeMatches = data;

        this.sortNodeMatches();
        this.sortedNodeMatches = [...this.nodeMatches].sort((prev, curre) => {
          return prev.level <= curre.level ? -1 : 1;
        });
        this.makePagination();
        if (this.paginatedMatches.length > 0) {
          this.onPage(0);
        }
        console.log("--------");
        console.log(this.sortedNodeMatches);
        
        
        const maxLevel = this.sortedNodeMatchesOriginal[0]?.level;
        if (maxLevel !== undefined) {
       

          this.vegeta([...this.sortedNodeMatchesOriginal]).then((x) => {
            createTree(0, 0, x, maxLevel);
            console.log('---------------');

            console.log(x);
            console.log('---------------');

            if (x) {
              this.tree = x;
            }
          });
        }
      }
    });
  }

  onPage(event: number) {
    this.currentMatches = this.paginatedMatches[event];
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

  searchRelativeBelowChildren(
    childrenOf: Array<GraficalDuplexGeneratedNode>,
    nodeMatch: NodeMatchEntity
  ) {
    const response = [];
    let i = 0;
    for (const child of childrenOf) {
      if (nodeMatch.level + 1 === child.level) {
        if (nodeMatch.match.teamAId === child.id1) {
          response.push({
            child,
            image: child.node1.image,
            index: i,
            self: child.node1.text.name,
          });
        } else if (nodeMatch.match.teamAId === child.id2) {
          response.push({
            child,
            image: child.node2.image,
            index: i,
            self: child.node2.text.name,
          });
        }
      }

      if (
        nodeMatch.level + 1 === child.level &&
        (nodeMatch.match.teamBId === child.id1 ||
          nodeMatch.match.teamBId === child.id2)
      ) {
        if (nodeMatch.match.teamBId === child.id1) {
          response.push({
            child,
            image: child.node1.image,
            index: i,
            self: child.node1.text.name,
          });
        } else if (nodeMatch.match.teamBId === child.id2) {
          response.push({
            child,
            image: child.node2.image,
            index: i,
            self: child.node2.text.name,
          });
        }
      }

      i++;
    }
    return response;
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

  private sortNodeMatches() {
    this.sortedNodeMatchesOriginal = [...this.nodeMatches]
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
