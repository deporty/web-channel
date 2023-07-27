import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FixtureStageEntity,
  TournamentEntity,
  TournamentStatusType,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { AddTeamCardComponent } from 'src/app/features/tournaments/presentation/components/add-team-card/add-team-card.component';
import {
  CreateFixtureStageCommand,
  GetFixtureStagesCommand,
  TransactionDeletedEvent,
} from 'src/app/features/tournaments/state-management/fixture-stages/fixture-stages.actions';
import {
  GetTournamentByIdCommand,
  ModifyRegisteredTeamStatusCommand,
  ModifyTournamentLocationsCommand,
  ModifyTournamentRefereesCommand,
  ModifyTournamentStatusCommand,
  TransactionDeletedEvent as TournamentsTransactionDeletedEvent,
} from '../../../tournaments/state-management/tournaments/tournaments.actions';
import {
  selectTransactionById as TournamentsSelectTransactionById,
  selectTournamentById,
} from '../../../tournaments/state-management/tournaments/tournaments.selector';
import { selectTransactionById } from 'src/app/features/tournaments/state-management/fixture-stages/fixture-stages.selector';
import { RegisterTeamsCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { CreateFixtureStageComponent } from './components/create-fixture-stage/create-fixture-stage.component';
import { ChangeTournamentStatusComponent } from './components/change-tournament-status/change-tournament-status.component';
import { ChangeRegisteredTeamStatusComponent } from './components/change-registerd-team-status/change-registerd-team-status.component';
import {
  RegisteredTeamEntity,
  RegisteredTeamStatus,
} from '@deporty-org/entities/tournaments/registered-teams.entity';
import { EditTournamentLocationsComponent } from './components/edit-tournament-locations/edit-tournament-locations.component';
import { Id, LocationEntity } from '@deporty-org/entities';
import { EditRefereesComponent } from './components/edit-referees/edit-referees.component';
import { GetTournamentLayoutByIdCommand } from '../../organizations.commands';
import { selectTournamentLayoutById } from '../../organizations.selector';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';

@Component({
  selector: 'app-edit-tournament',
  templateUrl: './edit-tournament.component.html',
  styleUrls: ['./edit-tournament.component.scss'],
})
export class EditTournamentComponent implements OnInit, OnDestroy {
  static route = 'tournament';
  tournamentId: any;
  sideNavOptions: GeneralAction[];
  registerTeamsDialog: any;

  selectTransactionByIdSubscription!: Subscription;
  $tournament!: Observable<TournamentEntity | undefined>;
  tournament!: TournamentEntity;
  tournamentSuscription!: Subscription;
  $tournamentLayout!: Observable<TournamentLayoutEntity>;
  tournamentLayoutSuscription!: Subscription;
  tournamentLayoutId!: Id;
  tournamentLayout!: TournamentLayoutEntity;
  organizationId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private dialog: MatDialog,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private translateService: TranslateService
  ) {
    this.sideNavOptions = [
      {
        background: 'transparent',
        color: 'black',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
        handler: () => {
          this.registerTeamIntoTournament();
        },
        icon: 'group_add',
        identifier: 'register-team-into-tournament',
        display: 'Inscribir equipo',
      },

      {
        background: 'transparent',
        color: 'black',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
        handler: () => {
          this.createFixtureStage();
        },
        icon: 'tab',
        identifier: 'create-fixture-stage',
        display: 'Crear fase de grupos',
      },
      {
        background: 'transparent',
        color: 'black',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
        handler: () => {
          this.changeTournamentStatus();
        },
        icon: 'healing',
        identifier: 'modify-tournament-status',
        display: 'Modificar estado del torneo',
      },
      {
        background: 'transparent',
        color: 'black',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
        handler: () => {
          this.editTournamentLocations();
        },
        icon: 'location_on',
        identifier: 'edit-tournament-locations',
        display: 'Editar ubicaciones',
      },
      {
        background: 'transparent',
        color: 'black',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
        handler: () => {
          this.editTournamentReferees();
        },
        icon: 'sports',
        identifier: 'modify-tournament-referees',
        display: 'Editar réferis',
      },
    ];
  }
  ngOnDestroy(): void {
    this.selectTransactionByIdSubscription?.unsubscribe();
    this.tournamentSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.tournamentId = params.tournamentId;
      this.tournamentLayoutId = params.tournamentLayoutId;
      this.organizationId = params.organizationId;

      this.store.dispatch(
        GetTournamentLayoutByIdCommand({
          organizationId: this.organizationId,
          tournamentLayoutId: this.tournamentLayoutId,
        })
      );

      this.$tournamentLayout = this.store.select(
        selectTournamentLayoutById(this.tournamentLayoutId)
      );

      this.tournamentLayoutSuscription = this.$tournamentLayout.subscribe(
        (tournamentLayout) => {
          this.tournamentLayout = tournamentLayout
        }
      );

      this.store.dispatch(
        GetTournamentByIdCommand({
          tournamentId: this.tournamentId,
        })
      );

      this.$tournament = this.store.select(
        selectTournamentById(this.tournamentId)
      );

      this.tournamentSuscription = this.$tournament.subscribe((val) => {
        if (val) {
          this.tournament = val;
        }
      });

      this.store.dispatch(
        GetFixtureStagesCommand({
          tournamentId: this.tournamentId,
        })
      );
    });
  }

  onUpdateStatus(registeredTeamEntity: RegisteredTeamEntity) {
    const identifier = 'update-registered-team-by-id';

    if (!hasPermission(identifier, this.resourcesPermissions)) {
      return;
    }

    const _dialog = this.dialog.open(ChangeRegisteredTeamStatusComponent, {
      data: {
        currentStatus: registeredTeamEntity.status,
      },
    });

    _dialog
      .afterClosed()
      .subscribe((status: RegisteredTeamStatus | undefined) => {
        if (status) {
          const data: any = {
            status,
            tournamentId: this.tournamentId,
            registeredTeamId: registeredTeamEntity.id!,
          };
          const transactionId = getTransactionIdentifier(data);
          this.store.dispatch(
            ModifyRegisteredTeamStatusCommand({
              transactionId,
              ...data,
            })
          );

          this.selectTransactionByIdSubscription = admingPopUpInComponent({
            dialog: this.dialog,
            store: this.store,
            TransactionDeletedEvent: TournamentsTransactionDeletedEvent,
            selectTransactionById: TournamentsSelectTransactionById,
            transactionId,
            translateService: this.translateService,
          });
        }
      });
  }

  createFixtureStage() {
    const _dialog = this.dialog.open(CreateFixtureStageComponent, {});
    _dialog.afterClosed().subscribe((order: number) => {
      const fixtureStage: FixtureStageEntity = {
        order,
        tournamentId: this.tournamentId,
      };
      const transactionId = getTransactionIdentifier(fixtureStage);
      this.store.dispatch(
        CreateFixtureStageCommand({
          transactionId,
          fixtureStage,
        })
      );

      this.selectTransactionByIdSubscription = admingPopUpInComponent({
        dialog: this.dialog,
        selectTransactionById,
        store: this.store,
        TransactionDeletedEvent,
        transactionId,
        translateService: this.translateService,
      });
    });
  }

  editTournamentLocations() {
    const _dialog = this.dialog.open(EditTournamentLocationsComponent, {
      width: '90vw',
      height: '90vh',
      maxHeight: '400px',
      data: {
        currentLocations: this.tournament.locations,
      },
    });

    _dialog.afterClosed().subscribe((locations: Id[]) => {
      if (locations) {
        const data: any = {
          locations,
          tournamentId: this.tournamentId,
        };
        const transactionId = getTransactionIdentifier(data);
        this.store.dispatch(
          ModifyTournamentLocationsCommand({
            transactionId,
            ...data,
          })
        );

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          store: this.store,
          TransactionDeletedEvent: TournamentsTransactionDeletedEvent,
          selectTransactionById: TournamentsSelectTransactionById,
          transactionId,
          translateService: this.translateService,
        });
      }
    });
  }
  editTournamentReferees() {
    const _dialog = this.dialog.open(EditRefereesComponent, {
      width: '90vw',
      height: '90vh',
      maxHeight: '400px',
      data: {
        currentReferees: this.tournament.refereeIds,
      },
    });

    _dialog.afterClosed().subscribe((refereeIds: Id[]) => {
      if (refereeIds) {
        const data: any = {
          refereeIds,
          tournamentId: this.tournamentId,
        };
        const transactionId = getTransactionIdentifier(data);
        this.store.dispatch(
          ModifyTournamentRefereesCommand({
            transactionId,
            ...data,
          })
        );

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          store: this.store,
          TransactionDeletedEvent: TournamentsTransactionDeletedEvent,
          selectTransactionById: TournamentsSelectTransactionById,
          transactionId,
          translateService: this.translateService,
        });
      }
    });
  }
  changeTournamentStatus() {
    const _dialog = this.dialog.open(ChangeTournamentStatusComponent, {
      data: {
        currentStatus: this.tournament.status,
      },
    });
    _dialog
      .afterClosed()
      .subscribe((status: TournamentStatusType | undefined) => {
        if (status) {
          const data: any = {
            status,
            tournamentId: this.tournamentId,
          };
          const transactionId = getTransactionIdentifier(data);
          this.store.dispatch(
            ModifyTournamentStatusCommand({
              transactionId,
              status,
              tournamentId: this.tournamentId,
            })
          );

          this.selectTransactionByIdSubscription = admingPopUpInComponent({
            dialog: this.dialog,
            store: this.store,
            TransactionDeletedEvent: TournamentsTransactionDeletedEvent,
            selectTransactionById: TournamentsSelectTransactionById,
            transactionId,
            translateService: this.translateService,
          });
        }
      });
  }
  registerTeamIntoTournament() {
    const dialogRef = this.dialog.open(AddTeamCardComponent, {
      data: {
        tournamentId: this.tournamentId,
        category: this.tournament.category,
      },
    });

    dialogRef.afterClosed().subscribe((result: TeamEntity[]) => {
      const teamsToAdd = result;

      if (result) {
        const transactionId = getTransactionIdentifier(teamsToAdd);

        this.store.dispatch(
          RegisterTeamsCommand({
            tournamentId: this.tournamentId,
            teams: teamsToAdd,
            transactionId,
          })
        );

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          selectTransactionById: TournamentsSelectTransactionById,
          store: this.store,
          TransactionDeletedEvent: TournamentsTransactionDeletedEvent,
          transactionId,
          translateService: this.translateService,
        });
      } else {
        this.registerTeamsDialog?.close();
      }
    });
  }
}
