import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Id } from '@deporty-org/entities/general';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FixtureStageEntity,
  GroupEntity,
  IntergroupMatchEntity,
  MatchStatusType,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import {
  DEFAULT_CANCEL_ACTION_STYLE,
  DEFAULT_DANGER_ACTION_STYLE,
  DEFAULT_PRIMARY_ACTION_STYLE,
  ModalComponent,
} from 'src/app/core/presentation/components/modal/modal.component';
import {
  DeleteFixtureStageCommand,
  TransactionDeletedEvent as FixtureStageTransactionDeletedEvent,
} from '../../../state-management/fixture-stages/fixture-stages.actions';
import {
  selectTransactionById as selectFixtureStageTransactionById,
  selectFixtureStagesByTournamentId,
} from '../../../state-management/fixture-stages/fixture-stages.selector';
import {
  AddTeamToGroupCommand,
  CreateGroupCommand,
  DeleteGroupCommand,
  DeleteTeamsInGroupCommand,
  GetGroupsByFixtureStageCommand,
  PublishAllMatchesInGroupCommand,
  TransactionDeletedEvent,
} from '../../../state-management/groups/groups.actions';
import {
  selectGroupsByFixtureStageId,
  selectTeamsByFixtureStageId,
  selectTransactionById,
} from '../../../state-management/groups/groups.selector';
import {
  DeleteIntergroupMatchCommand,
  GetIntergroupMatchesCommand,
  TransactionDeletedEvent as IntergroupMatchTransactionDeletedEvent,
} from '../../../state-management/intergroup-matches/intergroup-matches.actions';
import {
  selectTransactionById as intergroupMatchSelectTransactionById,
  selectIntergroupMatchesByTournamentIdAndFixtureStageId,
} from '../../../state-management/intergroup-matches/intergroup-matches.selector';
import { selectTransactionById as matchesSelectTransactionById } from '../../../state-management/matches/matches.selector';
import { AddMatchCardComponent } from '../add-match-card/add-match-card.component';
import { AddTeamToGroupCardComponent } from '../add-team-to-group-card/add-team-to-group-card.component';
import { CreateGroupComponent } from '../create-group/create-group.component';

import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import {
  AddMatchToGroupCommand,
  TransactionDeletedEvent as matchesTransactionDeletedEvent,
} from '../../../state-management/matches/matches.actions';
import { EditMatchInGroupComponent } from '../../pages/edit-match-group/edit-match-group.component';

import { MatExpansionPanel } from '@angular/material/expansion';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { CreateIntergroupMatchCommand } from '../../../state-management/intergroup-matches/intergroup-matches.actions';
import { EditIntergroupMatchComponent } from '../../pages/edit-intergroup-match/edit-intergroup-match.component';
import { MatchVisualizationComponent } from '../match-visualization/match-visualization.component';
import {
  ACCENT_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WARN_COLOR,
} from 'src/app/app.constants';

@Component({
  selector: 'app-fixture-stage',
  templateUrl: './fixture-stage.component.html',
  styleUrls: ['./fixture-stage.component.scss'],
})
export class FixtureStageComponent implements OnInit, OnDestroy {
  $fixtureStages!: Observable<FixtureStageEntity[] | undefined>;
  $fixtureStagesSubscription!: Subscription;
  $groupSubscription!: Subscription;
  $groups!: { [fixtureStageId: Id]: Observable<GroupEntity[]> };
  $groupsSusbscriptions!: { [fixtureStageId: Id]: Subscription };
  $intergroupMatches!: {
    [fixtureStageId: Id]: Observable<IntergroupMatchEntity[] | undefined>;
  };
  fixtureStage!: FixtureStageEntity;
  fixtureStages!: FixtureStageEntity[];
  groupIds: { [index: string]: boolean };
  @ViewChildren(MatExpansionPanel) groupPanels!: QueryList<MatExpansionPanel>;
  ids: Array<string>;
  @Input('let-editions') letEditions = false;
  @Output('on-exist-data') onExistData: EventEmitter<boolean>;
  selectTransactionByIdSubscription!: Subscription;
  @Input('tournament-id') tournamentId!: Id;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;

  constructor(
    private store: Store<any>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
    this.onExistData = new EventEmitter<boolean>();

    this.ids = [];
    this.groupIds = {};
    this.$groups = {};
    this.$intergroupMatches = {};
    this.$groupsSusbscriptions = {};
  }

  publishAllMatchesInGroup(tournamentId: Id, group: GroupEntity) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '200px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de publicar todos los partidos de este grupo?',
        text: 'Si continúas, todos los partidos en estado de "En Edición" serán visibles para tus usuarios.',
        actions: [
          {
            display: 'Publicar',
            ...DEFAULT_PRIMARY_ACTION_STYLE,
            handler: () => {
              const data = {
                tournamentId: this.tournamentId,
                fixtureStageId: group.fixtureStageId!,
                groupId: group.id!,
              };
              const transactionId = getTransactionIdentifier(data);
              this.store.dispatch(
                PublishAllMatchesInGroupCommand({ ...data, transactionId })
              );

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                selectTransactionById,
                store: this.store,
                TransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          } as GeneralAction,
          {
            display: 'Cancelar',
            ...DEFAULT_CANCEL_ACTION_STYLE,
            handler: () => {},
          } as GeneralAction,
        ],
      },
    });
  }

  deleteGroup(tournamentId: Id, group: GroupEntity) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '300px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de eliminar este grupo?',
        text: 'Si continúas, se eliminarán todos los partidos registrados.',
        actions: [
          {
            display: 'Eliminar',
            background: WARN_COLOR,
            color: 'white',
            handler: () => {
              const data = {
                tournamentId: this.tournamentId,
                fixtureStageId: group.fixtureStageId!,
                groupId: group.id!,
              };
              const transactionId = getTransactionIdentifier(data);
              this.store.dispatch(
                DeleteGroupCommand({ ...data, transactionId })
              );

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                selectTransactionById,
                store: this.store,
                TransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          } as GeneralAction,
          {
            display: 'Cancelar',
            handler: () => {},
          } as GeneralAction,
        ],
      },
    });
  }

  expandedPanel(group: GroupEntity) {
    this.groupIds[group.id!] = true;
  }

  getNameByStage(index: number) {
    if (index == 0) {
      return 'Inicial';
    }
    return 'Complementaria';
  }

  isAllowedToAddTeam() {
    const identifier = 'add-team-to-group';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  isAllowedToDeleteIntergroupMatch() {
    const identifier = 'delete-intergroup-match';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  isAllowedToDeleteTeam() {
    const identifier = 'delete-team-in-group';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  isAllowedToEditIntergroupMatch() {
    const identifier = 'edit-intergroup-match';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  isAllowedToEditMatch() {
    const identifier = 'edit-match-in-group';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  ngOnDestroy(): void {
    this.$fixtureStagesSubscription?.unsubscribe();
    this.selectTransactionByIdSubscription?.unsubscribe();
    this.$groupSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.$fixtureStages = this.store
      .select(selectFixtureStagesByTournamentId(this.tournamentId))
      .pipe(
        map((data) => {
          return data?.sort((prev, curr) => (prev.order > curr.order ? 1 : -1));
        })
      );

    this.$fixtureStagesSubscription = this.$fixtureStages.subscribe(
      (fixtureStages) => {
        if (fixtureStages) {
          this.onExistData.emit(fixtureStages.length > 0);

          this.fixtureStages = fixtureStages;

          const lastFixtureStage = [...fixtureStages]
            .sort((prev, cur) => {
              return prev.order > cur.order ? 1 : -1;
            })
            .pop();
          if (lastFixtureStage) {
            this.fixtureStage = lastFixtureStage;

            this.selectionChange(lastFixtureStage);
          }
        }
      }
    );
  }

  onAddMatch(group: GroupEntity) {
    const addMatchCardComponentDialog = this.dialog.open(
      AddMatchCardComponent,
      {
        data: {
          teams:
            group.teamIds.length > 0
              ? zip(
                  ...group.teamIds.map((t) =>
                    this.store
                      .select(selectTeamWithMembersById(t))
                      .pipe(map((x) => x.team))
                  )
                )
              : of([]),
        },
      }
    );

    addMatchCardComponentDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        const data = {
          tournamentId: this.tournamentId,
          fixtureStageId: group.fixtureStageId,
          groupId: group.id!,
          teamAId: result.teamA.id,
          teamBId: result.teamB.id,
        };
        const transactionId = getTransactionIdentifier(data);

        this.store.dispatch(AddMatchToGroupCommand({ ...data, transactionId }));

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          selectTransactionById: matchesSelectTransactionById,
          store: this.store,
          TransactionDeletedEvent: matchesTransactionDeletedEvent,
          transactionId,
          translateService: this.translateService,
        });
      }
    });
  }

  onAddTeam(group: GroupEntity) {
    const addTeamCardComponentDialog = this.dialog.open(
      AddTeamToGroupCardComponent
    );

    addTeamCardComponentDialog
      .afterClosed()
      .subscribe((result: TeamEntity[]) => {
        if (result) {
          const data = {
            fixtureStageId: group.fixtureStageId,
            tournamentId: this.tournamentId,
            groupId: group.id!,
            teams: result.map((x) => x.id!),
          };
          const transactionId = getTransactionIdentifier(data);

          this.store.dispatch(
            AddTeamToGroupCommand({ ...data, transactionId })
          );

          this.selectTransactionByIdSubscription = admingPopUpInComponent({
            dialog: this.dialog,
            selectTransactionById,
            store: this.store,
            TransactionDeletedEvent,
            transactionId,
            translateService: this.translateService,
          });
        }
      });
  }

  onDeleteIntergroupMatch(
    fixtureStage: FixtureStageEntity,
    intergroupMatch: IntergroupMatchEntity
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '300px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de eliminar este partido?',
        text: 'Se actualizará la tabla de posiciones de los respectivos grupos',
        actions: [
          {
            display: 'Eliminar',
            ...DEFAULT_DANGER_ACTION_STYLE,
            handler: () => {
              const data = {
                tournamentId: this.tournamentId,
                fixtureStageId: fixtureStage.id!,
                intergroupMatchId: intergroupMatch.id!,
              };
              const transactionId = getTransactionIdentifier(data);
              this.store.dispatch(
                DeleteIntergroupMatchCommand({ ...data, transactionId })
              );

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                selectTransactionById: intergroupMatchSelectTransactionById,
                store: this.store,
                TransactionDeletedEvent: IntergroupMatchTransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          } as GeneralAction,
          {
            display: 'Cancelar',
            ...DEFAULT_DANGER_ACTION_STYLE,
            handler: () => {},
          } as GeneralAction,
        ],
      },
    });
  }

  onDeleteTeam(team: any, group: GroupEntity, tournamentId: Id) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '300px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de eliminar este equipo del grupo?',
        text: 'Si continúas, se eliminarán todos los partidos registrados.',
        actions: [
          {
            display: 'Eliminar',
            background: WARN_COLOR,
            color: 'white',
            handler: () => {
              const data = {
                tournamentId: this.tournamentId,
                fixtureStageId: group.fixtureStageId!,
                groupId: group.id!,
                teamIds: [team.team.id!],
              };
              const transactionId = getTransactionIdentifier(data);
              this.store.dispatch(
                DeleteTeamsInGroupCommand({ ...data, transactionId })
              );

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                selectTransactionById,
                store: this.store,
                TransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          } as GeneralAction,
          {
            display: 'Cancelar',
            handler: () => {},
          } as GeneralAction,
        ],
      },
    });
  }

  onEditIntergroupMatch(data: IntergroupMatchEntity) {
    const addTeamCardComponentDialog = this.dialog.open(
      EditIntergroupMatchComponent,
      {
        data: {
          ...data,
          tournamentId: this.tournamentId,
        },
        height: '90vh',
        width: '90vw',
      }
    );
  }

  onEditMatch(data: any) {
    const addTeamCardComponentDialog = this.dialog.open(
      EditMatchInGroupComponent,
      {
        data: {
          ...data,
          tournamentId: this.tournamentId,
        },
        height: '90vh',
        width: '90vw',
      }
    );
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

  openCreateGroupDialog(stage: FixtureStageEntity): void {
    const createGroupDialogRef = this.dialog.open(CreateGroupComponent, {});

    createGroupDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          fixtureStageId: stage.id as Id,
          tournamentId: this.tournamentId,
          groupLabel: result.groupLabel,
          groupOrder: result.groupOrder,
        };
        const transactionId = getTransactionIdentifier(data);

        this.store.dispatch(CreateGroupCommand({ ...data, transactionId }));

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          selectTransactionById,
          store: this.store,
          extraData: {
            label: result.groupLabel,
          },
          TransactionDeletedEvent,
          transactionId,
          translateService: this.translateService,
        });
      }
    });
  }

  openCreateIntergroupMatchDialog(stage: FixtureStageEntity): void {
    const dialogRef = this.dialog.open(AddMatchCardComponent, {
      width: '300px',
      height: '450px',
      data: {
        teams: this.store.select(selectTeamsByFixtureStageId(stage.id!)).pipe(
          mergeMap((teamIds: Id[]) => {
            return teamIds.length > 0
              ? zip(
                  ...teamIds.map((t) =>
                    this.store
                      .select(selectTeamWithMembersById(t))
                      .pipe(map((x) => x.team))
                  )
                )
              : of([]);
          })
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          tournamentId: this.tournamentId,
          fixtureStageId: stage.id!,
          teamAId: result.teamA.id,
          teamBId: result.teamB.id,
        };

        const transactionId = getTransactionIdentifier(data);
        this.store.dispatch(
          CreateIntergroupMatchCommand({ ...data, transactionId })
        );

        this.selectTransactionByIdSubscription = admingPopUpInComponent({
          dialog: this.dialog,
          selectTransactionById: intergroupMatchSelectTransactionById,
          store: this.store,
          TransactionDeletedEvent: IntergroupMatchTransactionDeletedEvent,
          transactionId,
          translateService: this.translateService,
        });
      }
    });
  }

  openDeleteFixtureDialog(stage: FixtureStageEntity): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '300px',
      data: {
        kind: 'text',
        title: '¿Estás seguro de eliminar esta etapa?',
        text: 'Si continúas, se eliminarán todos los partidos registrados en los grupos de la misma.',
        actions: [
          {
            display: 'Eliminar',
            ...DEFAULT_DANGER_ACTION_STYLE,
            handler: () => {
              const transactionId = getTransactionIdentifier({
                tournamentId: this.tournamentId,
                fixtureStageId: stage.id!,
              });
              this.store.dispatch(
                DeleteFixtureStageCommand({
                  tournamentId: this.tournamentId,
                  fixtureStageId: stage.id!,
                  transactionId,
                })
              );

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                selectTransactionById: selectFixtureStageTransactionById,
                store: this.store,
                TransactionDeletedEvent: FixtureStageTransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          } as GeneralAction,
          {
            display: 'Cancelar',
            ...DEFAULT_CANCEL_ACTION_STYLE,
            handler: () => {},
          } as GeneralAction,
        ],
      },
    });
  }

  selectionChange(fixtureStage: FixtureStageEntity) {
    this.$groupSubscription?.unsubscribe();
    this.$groups[fixtureStage.id!] = this.store.select(
      selectGroupsByFixtureStageId(fixtureStage.id!)
    );

    this.$groupSubscription = this.$groups[fixtureStage.id!].subscribe(
      (groups: GroupEntity[]) => {
        setTimeout(() => {
          if (this.groupPanels.first) this.groupPanels.first.expanded = true;
        }, 300);
      }
    );
    this.$intergroupMatches[fixtureStage.id!] = this.store
      .select(
        selectIntergroupMatchesByTournamentIdAndFixtureStageId(
          this.tournamentId,
          fixtureStage.id!
        )
      )
      .pipe(
        map((data) => {
          return data?.map((y) => y.intergroupMatch);
        })
      );

    if (this.ids.indexOf(fixtureStage.id!) == -1) {
      this.ids.push(fixtureStage.id!);
      this.store.dispatch(
        GetGroupsByFixtureStageCommand({
          tournamentId: fixtureStage.tournamentId,
          fixtureStageId: fixtureStage.id!,
        })
      );
      const states: MatchStatusType[] = ['completed', 'published', 'running'];
      if (this.letEditions) {
        states.push('editing');
      }
      this.store.dispatch(
        GetIntergroupMatchesCommand({
          tournamentId: fixtureStage.tournamentId,
          fixtureStageId: fixtureStage.id!,
          states,
        })
      );
    }
  }
}
