import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Id } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TeamEntity } from '@deporty-org/entities/teams';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';
import { RegisteredTeamStatus } from '@deporty-org/entities/tournaments/registered-teams.entity';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  REGISTERED_TEAM_STATUS_CODES,
  WARN_COLOR,
} from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { ModalComponent } from 'src/app/core/presentation/components/modal/modal.component';
import { TEAMS_MAIN_PATH } from 'src/app/features/teams/constants';
import { GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import {
  ClearRegisteredTeamsCommand,
  DeleteRegisteredTeamsCommand,
  GetRegisteredTeamsCommand,
  TransactionResolvedEvent,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import {
  selecRegisteredTeams,
  selectTransactionById,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';

@Component({
  selector: 'app-registered-teams',
  templateUrl: './registered-teams.component.html',
  styleUrls: ['./registered-teams.component.scss'],
})
export class RegisteredTeamsComponent implements OnInit, OnDestroy {
  @Input('let-editions') letEditions = false;
  @Input('tournament-id') tournamentId!: string | undefined;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;

  @Output('on-update-status')
  onUpdateStatus: EventEmitter<RegisteredTeamEntity>;

  availableStatus!: RegisteredTeamStatus[];

  $registeredTeams!: Observable<
    { registeredTeam: RegisteredTeamEntity; team: TeamEntity }[]
  >;
  selectTransactionByIdSubscription!: Subscription;

  constructor(
    private store: Store<AppState>,
    private translateService: TranslateService,
    public dialog: MatDialog,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
    this.onUpdateStatus = new EventEmitter<RegisteredTeamEntity>();
  }
  ngOnDestroy(): void {
    this.store.dispatch(ClearRegisteredTeamsCommand());
    this.selectTransactionByIdSubscription?.unsubscribe();
  }

  getDisplay(status: RegisteredTeamStatus) {
    return REGISTERED_TEAM_STATUS_CODES.filter((x) => x.name == status).pop()
      ?.display;
  }
  getClass(status: RegisteredTeamStatus) {
    return status?.replace(/ /g, '-');
  }

  navigate(team: TeamEntity) {
    window.open(['.', TEAMS_MAIN_PATH, 'team', team.id!].join('/'), '_blank');
  }

  isAllowedToDelete() {
    const identifier = 'delete-registered-team-by-id';

    return !hasPermission(identifier, this.resourcesPermissions);
  }
  deleteRegisteredTeam(id: Id) {
    this.dialog.open(ModalComponent, {
      width: '300px',
      height: '300px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de eliminar este equipo?',
        text: 'Si procede, dicho equipo no participará en el torneo.',
        actions: [
          {
            display: 'Eliminar',
            background: WARN_COLOR,
            color: 'white',
            handler: () => {
              const transactionId = getTransactionIdentifier(id);

              this.store.dispatch(
                DeleteRegisteredTeamsCommand({
                  tournamentId: this.tournamentId!,
                  transactionId,
                  registeredTeamId: id,
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
            },
          },
          {
            display: 'Cancelar',
          },
        ],
      },
    });
  }
  ngOnInit(): void {
    if (this.tournamentId) {
      this.availableStatus = [
        'enabled',
        'pre-registered',
        'pre-registered and enabled',
      ];

      if (
        this.tournamentLayout &&
        this.tournamentLayout.registeredTeamsVisibleStatus
      ) {
        this.availableStatus =
          this.tournamentLayout.registeredTeamsVisibleStatus;
      }

      this.store.dispatch(
        GetRegisteredTeamsCommand({
          tournamentId: this.tournamentId,
        })
      );
    }
    this.$registeredTeams = this.store.select(selecRegisteredTeams).pipe(
      filter((data: RegisteredTeamEntity[] | undefined) => {
        return !!data;
      }),
      mergeMap((registeredTeams: RegisteredTeamEntity[] | undefined) => {
        console.log("Aldair",registeredTeams );
        
        const res = [];
        for (const registeredTeam of registeredTeams!) {
          this.store.dispatch(
            GetTeamByIdCommand({
              teamId: registeredTeam.teamId,
            })
          );
          res.push(
            this.store
              .select(selectTeamWithMembersById(registeredTeam.teamId))
              .pipe(
                filter((data) => {
                  return !!data.team;
                }),

                map((val) => {
                  return {
                    team: val.team,
                    registeredTeam,
                  };
                })
              )
          );
        }
        if (res.length > 0) {
          return zip(...res);
        }
        return of([]);
      })
    );
  }
}
