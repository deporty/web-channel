import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities/general';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FixtureStageEntity,
  IntergroupMatchEntity,
  MatchEntity,
  RegisteredTeamEntity,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DEFAULT_TOURNAMENT_LAYOUT_IMG } from 'src/app/app.constants';
import { getDisplay } from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { GetTournamentLayoutByIdCommand } from 'src/app/features/organizations/organizations.commands';
import { selectTournamentLayoutById } from 'src/app/features/organizations/organizations.selector';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { GetFixtureStagesCommand } from '../../../state-management/fixture-stages/fixture-stages.actions';
import { GetMainDrawByTournamentCommand } from '../../../state-management/main-draw/main-draw.commands';
import { GetTournamentByIdCommand } from '../../../state-management/tournaments/tournaments.actions';
import {
  selectAvailablesTeamsToAdd,
  selectCurrentTournament,
} from '../../../state-management/tournaments/tournaments.selector';
import { AddMatchCardComponent } from '../../components/add-match-card/add-match-card.component';
import { GROUP_LETTERS } from '../../components/components.constants';
import { EditMatchInGroupComponent } from '../edit-match-group/edit-match-group.component';
import { MatchVisualizationComponent } from '../../components/match-visualization/match-visualization.component';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss'],
})
export class TournamentDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static route = 'tournament-detail';

  @ViewChild(MatTabGroup, { static: false }) matTabGroup!: MatTabGroup;

  letters = GROUP_LETTERS;

  $fixture!: Observable<FixtureStageEntity | undefined>;

  tournamentId!: Id;
  tournament!: TournamentEntity;
  $tournament!: Observable<TournamentEntity | undefined>;
  $tournamentSubscription!: Subscription;
  $tournamentLayout!: Observable<TournamentLayoutEntity>;

  $fixtureIndicators!: Observable<Set<string>>;

  statusMapper: any;
  teams: TeamEntity[] = [];
  $availableTeamsToAdd!: Observable<TeamEntity[] | undefined>;
  $teamSubscription!: Subscription;
  selectedTeams: any;

  // $markersTable!: Observable<any[] | undefined>;
  // markersTable!: any[];
  getDisplay = getDisplay;
  currentIndexGroup!: number;
  currentLabelGroup!: string;
  stageId!: string;
  img: string = DEFAULT_TOURNAMENT_LAYOUT_IMG;
  registerTeamsDialog: any;

  fixtureIndicadors: any;
  allConsulted: boolean;
  $registeredTeams!: Observable<RegisteredTeamEntity[] | undefined>;
  dialogNoMebers!: MatDialogRef<any> | null;

  // $interGroupMatches!: Observable<{ [index: string]: IntergroupMatchEntity[] }>;
  // intergroupMatches!: { [index: string]: IntergroupMatchEntity[] };

  isLoadedFixtureOverview: boolean;
  $positionTables!: Observable<any>;
  positionTables!: any;
  isLoadedPositionsTable: boolean;
  updateInsideTabs: boolean;
  wasShowed: boolean;
  tournamentLayout!: TournamentLayoutEntity;

  selectedIndex: number | null = null;
  modified = false;
  $podium!: Observable<TeamEntity>[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private store: Store<any>
  ) {
    this.updateInsideTabs = false;
    this.isLoadedFixtureOverview = false;
    this.isLoadedPositionsTable = false;
    this.allConsulted = false;
    this.statusMapper = {
      running: 'En progreso',
      canceled: 'Cancelado',
    };
    this.fixtureIndicadors = {};
    this.wasShowed = false;
  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.$teamSubscription?.unsubscribe();
    this.$tournamentSubscription?.unsubscribe();
  }
  getPodium() {
    if (this.tournament.podium) {
      const $podium = this.tournament.podium.map((x) => {
        return this.store.select(selectTeamById(x)).pipe(filter((y) => !!y));
      });

      this.$podium = $podium;
    }
  }
  isAllowedToAddMatch() {
    const identifier = 'tournaments:add-match:ui';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  // A un grupo
  isAllowedToAddTeam() {
    const identifier = 'tournaments:add-team:ui';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  setSeletedIndex() {
    if (!this.modified) {
      if (!this.matTabGroup) {
        setTimeout(() => {
          this.matTabGroup.selectedIndex = this.selectedIndex;
        }, 500);
      } else {
        this.matTabGroup.selectedIndex = this.selectedIndex;
      }
    }
  }
  existMainDrawData(exists: boolean) {
    if (exists) {
      if (this.selectedIndex == null) {
        this.selectedIndex = 0;
      } else {
        if (this.selectedIndex > 0) {
          this.selectedIndex = 0;
        }
      }
      this.setSeletedIndex();
    }
  }
  existFixtureStagesData(exists: boolean) {
    if (exists) {
      if (this.selectedIndex == null) {
        this.selectedIndex = 1;
      } else {
        if (this.selectedIndex > 1) {
          this.selectedIndex = 1;
        }
      }
      this.setSeletedIndex();
    }
  }

  isAllowedToEditMatch() {
    const identifier = 'tournaments:edit-match:ui';
    return hasPermission(identifier, this.resourcesPermissions);
  }
  ___setSelectors() {
    this.$tournament = this.store.select(selectCurrentTournament);
    this.$availableTeamsToAdd = this.store.select(selectAvailablesTeamsToAdd);
  }

  showNotification(tournamentId: string) {
    if (!this.wasShowed) {
      this.wasShowed = true;
    }
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const tournamentId = params.tournamentId;

      this.tournamentId = tournamentId;

      this.___setSelectors();

      this.store.dispatch(
        GetTournamentByIdCommand({
          tournamentId: tournamentId,
        })
      );

      this.store.dispatch(
        GetMainDrawByTournamentCommand({
          tournamentId: tournamentId,
        })
      );

      this.store.dispatch(
        GetFixtureStagesCommand({
          tournamentId: tournamentId,
        })
      );
    });

    this.$tournamentSubscription = this.$tournament.subscribe((data) => {
      if (data) {
        this.tournament = data;
        this.getPodium();

        this.store.dispatch(
          GetTournamentLayoutByIdCommand({
            organizationId: this.tournament.organizationId,
            tournamentLayoutId: this.tournament.tournamentLayoutId,
          })
        );
        this.$tournamentLayout = this.store.select(
          selectTournamentLayoutById(this.tournament.tournamentLayoutId)
        );
        this.$tournamentLayout.subscribe((data) => {
          if (data) this.tournamentLayout = data;
        });

        this.showNotification(this.tournament.id as string);

        this.closeLoadingModal();

        if (this.tournament.flayer) {
          this.img = this.tournament.flayer;
        }

        this.$positionTables?.subscribe((x) => {
          if (!x) {
            if (!this.isLoadedPositionsTable) {
              this.isLoadedPositionsTable = true;
            }
          } else {
            this.positionTables = x;
          }
        });
      }
    });
  }

  private closeLoadingModal() {
    if (this.dialogNoMebers) {
      this.dialogNoMebers.close();
      this.dialogNoMebers = null;
    }
  }

  selectedTabChange(event: MatTabChangeEvent) {
    if (event.tab.textLabel == 'Fechas') {
      this.updateInsideTabs = true;
    }
  }


  getPositionTable(stageId: string, groupLabel: string) {
    if (this.positionTables) {
      return this.positionTables[stageId][groupLabel];
    }
    return null;
  }


  openEditMatchDialog(teams: TeamEntity[], match: MatchEntity): void {
    const dialogRef = this.dialog.open(AddMatchCardComponent, {
      width: '400px',
      height: '400px',
      data: { teams, match },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const match: MatchEntity = {
          teamAId: result.teamA,
          teamBId: result.teamB,

          date: new Date(result.date),
          status: 'editing',
          observations: '',
        };

        if (result.scoreA >= 0 && result.scoreB >= 0) {
          match.score = {
            teamA: result.scoreA,
            teamB: result.scoreB,
          };
        }

        // const group = this.fixtureStages
        //   .filter((x) => {
        //     return x.id == this.stageId;
        //   })
        //   .pop()
        //   ?.groups.filter((x) => {
        //     return x.order == this.currentIndexGroup;
        //   })
        //   .pop();

        // if (group) {
        // this.editMatchOfGroupUsecase
        //   .call({
        //     match,
        //     groupIndex: group.index,
        //     stageIndex: this.stageId,
        //     tournamentId: this.tournament.id,
        //   })
        //   .subscribe(() => {
        //     this.getFixtureStages();
        //   });
        // }
      }
    });
  }
}
