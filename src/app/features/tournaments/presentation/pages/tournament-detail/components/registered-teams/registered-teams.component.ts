import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Id } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TeamEntity } from '@deporty-org/entities/teams';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';
import { RegisteredTeamStatus } from '@deporty-org/entities/tournaments/registered-teams.entity';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, zip } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
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
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
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
import { RegisteredMembersViewComponent } from './components/registered-members-view/registered-members-view.component';
import { RegisterMemberIntoTournamentComponent } from './components/register-member-into-tournament/register-member-into-tournament.component';

@Component({
  selector: 'app-registered-teams',
  templateUrl: './registered-teams.component.html',
  styleUrls: ['./registered-teams.component.scss'],
})
export class RegisteredTeamsComponent implements OnInit, OnDestroy {
  $registeredTeams!: Observable<
    { registeredTeam: RegisteredTeamEntity; team: TeamEntity }[]
  >;
  availableStatus!: RegisteredTeamStatus[];
  @Input('let-editions') letEditions = false;
  @Output('on-update-status')
  onUpdateStatus: EventEmitter<RegisteredTeamEntity>;
  @Output('on-watch-docs')
  onWatchDocs: EventEmitter<RegisteredTeamEntity>;
  selectTransactionByIdSubscription!: Subscription;
  @Input('tournament-id') tournamentId!: string | undefined;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;

  constructor(
    private store: Store<AppState>,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
    this.onUpdateStatus = new EventEmitter<RegisteredTeamEntity>();
    this.onWatchDocs = new EventEmitter<RegisteredTeamEntity>();
  }

  openBottomSheet(registeredTeam: any): void {
    console.log(registeredTeam);
    
    this._bottomSheet.open(RegisteredMembersViewComponent, {
      panelClass: 'bottom-sheet-container-with-no-padding',
      data: {
        members: registeredTeam.registeredTeam.members,
      },
    });
  }
  addNewMemberToTournament(registeredTeam: any): void {
    console.log(registeredTeam);
    
    this._bottomSheet.open(RegisterMemberIntoTournamentComponent, {
      panelClass: 'bottom-sheet-container-with-no-padding',
      data: {
        registeredMembers: registeredTeam.registeredTeam.members,
        teamId: registeredTeam.team.id,
        tournamentLayout: this.tournamentLayout,
        tournamentId: this.tournamentId
      },
    });
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

  getClass(status: RegisteredTeamStatus) {
    return status?.replace(/ /g, '-');
  }

  getDisplay(status: RegisteredTeamStatus) {
    return REGISTERED_TEAM_STATUS_CODES.filter((x) => x.name == status).pop()
      ?.display;
  }

  isAllowedToDelete() {
    const identifier = 'delete-registered-team-by-id';

    return !hasPermission(identifier, this.resourcesPermissions);
  }

  navigate(team: TeamEntity) {
    window.open(['.', TEAMS_MAIN_PATH, 'team', team.id!].join('/'), '_blank');
  }

  ngOnDestroy(): void {
    this.store.dispatch(ClearRegisteredTeamsCommand());
    this.selectTransactionByIdSubscription?.unsubscribe();
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
        const res = [];
        for (const registeredTeam of registeredTeams!) {
          res.push(
            this.store.select(selectTeamById(registeredTeam.teamId)).pipe(
              first((data) => {
                return !!data;
              }),

              map((val) => {
                return {
                  team: val,
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
