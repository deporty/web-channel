import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MemberEntity, TeamEntity, UserEntity } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import { IPlayerModel } from '@deporty-org/entities/players';
import {
  GroupEntity,
  MatchEntity,
  PlayerForm,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, zip } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { PadComponent } from 'src/app/core/presentation/components/pad/pad.component';
import {
  GetTeamByIdCommand,
  GetTeamsMembersCommand,
} from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationByIds } from '../../../state-management/locations/locations.selector';
import {
  EditGroupMatchCommand,
  TransactionResolvedEvent,
} from '../../../state-management/matches/matches.actions';
import { selectTransactionById } from '../../../state-management/matches/matches.selector';
import { GetTournamentByIdCommand } from '../../../state-management/tournaments/tournaments.actions';
import {
  selectPlayers,
  selectTournamentById,
} from '../../../state-management/tournaments/tournaments.selector';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';

@Component({
  selector: 'app-edit-match-group',
  templateUrl: './edit-match-group.component.html',
  styleUrls: ['./edit-match-group.component.scss'],
})
export class EditMatchInGroupComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static route = 'edit-match';

  meta!: any;
  @ViewChild('captainA', { static: false }) captainPadA!: PadComponent;
  @ViewChild('captainB', { static: false }) captainPadB!: PadComponent;
  @ViewChild('judge', { static: false }) judge!: PadComponent;
  @ViewChild('locationSelect', { static: false }) locationSelect!: MatSelect;
  @ViewChild('playgroundSelect', { static: false })
  playgroundSelect!: MatSelect;

  match!: MatchEntity;

  playersForm!: PlayerForm;
  stageId!: string;
  group!: GroupEntity;
  tournamentId!: string;

  status: string;

  $playersSelect: Observable<undefined | IPlayerModel[]>;
  $playersSelectSubscription!: Subscription;
  locations!: Array<LocationEntity>;
  referees!: Array<UserEntity>;

  loadingDialog!: MatDialogRef<any> | null;

  date: Date | undefined;
  teamA!: { team: TeamEntity; members: MemberEntity[] };
  teamB!: { team: TeamEntity; members: MemberEntity[] };

  selectTransactionByIdSubscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<EditMatchInGroupComponent>,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private store: Store<AppState>
  ) {
    this.status = '';

    this.$playersSelect = this.store.select(selectPlayers);
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.$playersSelectSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);

      this.meta = {
        tournamentId: this.data.tournamentId,
      };

      this.match = this.data.match;

      this.store.dispatch(
        GetTournamentByIdCommand({
          tournamentId: this.data.tournamentId,
        })
      );
      this.store.dispatch(
        GetTeamByIdCommand({
          teamId: this.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetTeamByIdCommand({
          teamId: this.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: this.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: this.match.teamBId!,
        })
      );

      this.store
        .select(selectTournamentById(this.data.tournamentId))
        .pipe(first((x) => !!x))
        .subscribe((data: TournamentEntity | undefined) => {
          if (data) {
            this.store.dispatch(
              GetLocationsByIdsCommand({
                ids: data.locations,
              })
            );

            this.store
              .select(selectLocationByIds(data.locations))
              .subscribe((locs) => {
                this.locations = locs;
                console.log('Locations: ', this.locations);
              });

            console.log(' **** ', data);

            if (data.refereeIds && data.refereeIds.length > 0) {
              const zipped = [];
              for (const id of data.refereeIds) {
                this.store.dispatch(
                  GetUserByIdCommand({
                    id: id,
                  })
                );

                zipped.push(
                  this.store.select(selectUserById(id)).pipe(filter((x) => !!x))
                );
              }
              zip(...zipped).subscribe((locs) => {
                this.referees = locs;
              });
            }else{
              this.referees = [];
            }


          }
        });
      this.store
        .select(selectTeamWithMembersById(this.match.teamAId))
        .subscribe((teamA) => {
          if (teamA)
            this.teamA = {
              team: teamA.team,
              members: Object.values(teamA.members),
            };
        });
      this.store
        .select(selectTeamWithMembersById(this.match.teamBId))
        .subscribe((teamB) => {
          if (teamB)
            this.teamB = {
              team: teamB.team,
              members: Object.values(teamB.members),
            };
        });

      this.group = this.data.group;
    }
  }

  saveData(data: any) {
    console.log('Data a enviar ', data);

    // const data: any = {
    //   locations,
    //   tournamentId: this.tournamentId,
    // };

    const transactionId = getTransactionIdentifier(data);

    this.store.dispatch(
      EditGroupMatchCommand({
        fixtureStageId: this.data.group.fixtureStageId,
        groupId: this.data.group.id,
        match: data.match,
        tournamentId: this.data.tournamentId,
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
      onSuccessAction: () => {
        this.dialogRef.close();
      },
    });
  }
}
