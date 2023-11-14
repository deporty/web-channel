import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MemberEntity, TeamEntity, UserEntity } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import {
  MatchEntity,
  NodeMatchEntity,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, zip } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getStageIndicator,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationByIds } from '../../../state-management/locations/locations.selector';
import { EditNodeMatchCommand } from '../../../state-management/main-draw/main-draw.commands';
import { TransactionResolvedEvent } from '../../../state-management/main-draw/main-draw.events';
import { selectTransactionById } from '../../../state-management/main-draw/main-draw.selector';
import {
  selectCurrentNodeMatch,
  selectTeamWithRegisteredMembers,
  selectTournamentById,
} from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-edit-node-match-group',
  templateUrl: './edit-node-match.component.html',
  styleUrls: ['./edit-node-match.component.scss'],
})
export class EditNodeMatchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static route = 'edit-node-match';
  meta!: any;

  nodeMatch!: NodeMatchEntity;
  match!: MatchEntity;

  nodeMatchId!: string;
  tournamentId!: string;
  referees!: Array<UserEntity>;

  locations: Array<LocationEntity>;

  $selectMatch: Observable<NodeMatchEntity | undefined>;
  groupLabel: any;
  date: Date | undefined;

  teamA!: { team: TeamEntity; members: MemberEntity[] };
  teamB!: { team: TeamEntity; members: MemberEntity[] };
  stageDisplayData!: { tag: string; color: string; background: string };

  selectTransactionByIdSubscription!: Subscription;
  $teamASuscription?: Subscription;
  $teamBSuscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditNodeMatchComponent>,

    private store: Store<AppState>
  ) {
    this.$selectMatch = this.store.select(selectCurrentNodeMatch);

    this.locations = [];
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.$teamASuscription?.unsubscribe();
    this.$teamBSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.data) {
      this.meta = {
        tournamentId: this.data.tournamentId,
      };

      this.nodeMatch = JSON.parse(JSON.stringify(this.data.nodeMatch));
      this.nodeMatch.tournamentId = this.data.tournamentId;
      this.tournamentId = this.data.tournamentId;

      this.match = this.nodeMatch.match;
      this.stageDisplayData = getStageIndicator(this.nodeMatch.level);

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
              });

            if (data.refereeIds && data.refereeIds.length > 0) {
              const zipped = [];
              for (const id of data.refereeIds) {
                this.store.dispatch(
                  GetUserByIdCommand({
                    id: id,
                    transactionId: id,
                  })
                );

                zipped.push(
                  this.store.select(selectUserById(id)).pipe(filter((x) => !!x))
                );
              }
              zip(...zipped).subscribe((locs) => {
                this.referees = locs;
              });
            } else {
              this.referees = [];
            }
          }
        });

      this.$teamASuscription = selectTeamWithRegisteredMembers(
        this.store,
        this.match.teamAId
      ).subscribe(([team, members]) => {
        this.teamA = {
          team: team,
          members: members,
        };
      });
      this.$teamBSuscription = selectTeamWithRegisteredMembers(
        this.store,
        this.match.teamBId
      ).subscribe(([team, members]) => {
        this.teamB = {
          team: team,
          members: members,
        };
      });
    }
  }

  // saveData(data: any) {
  //   if (this.nodeMatch) {
  //     this.tournamentAdapter
  //       .editNodeMatch(this.tournamentId, {
  //         ...this.nodeMatch,
  //         ...data.match,
  //       })
  //       .subscribe((x) => {});
  //   }
  // }

  saveData(data: any) {
    const currentNodeMatch: NodeMatchEntity = {
      ...this.nodeMatch,
      tournamentId: this.tournamentId,
      match: data.match as MatchEntity,
      id: this.nodeMatch.id,
    };
    console.log(currentNodeMatch);
    const transactionId = getTransactionIdentifier(currentNodeMatch);

    this.store.dispatch(
      EditNodeMatchCommand({
        nodeMatch: currentNodeMatch,
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
