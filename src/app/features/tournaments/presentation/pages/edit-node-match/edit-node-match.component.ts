import { Location } from '@angular/common';
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
import { ActivatedRoute } from '@angular/router';
import { LocationEntity } from '@deporty-org/entities/locations';
import {
  MatchEntity,
  NodeMatchEntity,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription, zip } from 'rxjs';
import AppState from 'src/app/app.state';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';
import {
  GetNodeMatchCommand,
  GetTournamentByIdCommand,
} from '../../../state-management/tournaments/tournaments.actions';
import {
  selectCurrentNodeMatch,
  selectTournamentById,
} from '../../../state-management/tournaments/tournaments.selector';
import {
  GetTeamByIdCommand,
  GetTeamsMembersCommand,
} from 'src/app/features/teams/state-management/teams.commands';
import { filter, first } from 'rxjs/operators';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationByIds } from '../../../state-management/locations/locations.selector';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';
import { MemberEntity, TeamEntity, UserEntity } from '@deporty-org/entities';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import {
  admingPopUpInComponent,
  getStageIndicator,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { EditGroupMatchCommand } from '../../../state-management/matches/matches.actions';
import { EditNodeMatchCommand } from '../../../state-management/main-draw/main-draw.commands';
import { TransactionResolvedEvent } from '../../../state-management/main-draw/main-draw.events';
import { selectTransactionById } from '../../../state-management/main-draw/main-draw.selector';
import { TranslateService } from '@ngx-translate/core';

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

  ngOnDestroy(): void {}

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
              });

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
            } else {
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
