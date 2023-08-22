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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LocationEntity } from '@deporty-org/entities/locations';
import {
  MatchEntity,
  NodeMatchEntity,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
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
  getStageIndicator,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';

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
  constructor(
    private activatedRoute: ActivatedRoute,
    private tournamentAdapter: TournamentAdapter,
    private location: Location,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
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

      this.nodeMatch = this.data.nodeMatch;
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

  ngOnInit1(): void {
    this.activatedRoute.queryParams.subscribe((x) => {
      this.nodeMatchId = x.nodeMatchId;
      this.tournamentId = x.tournamentId;

      this.meta = {
        tournamentId: this.tournamentId,
        nodeMatchId: this.nodeMatchId,
      };

      this.store.dispatch(
        GetNodeMatchCommand({
          tournamentId: this.tournamentId,
          nodeMatchId: this.nodeMatchId,
        })
      );

      this.$selectMatch.subscribe((x) => {
        if (x) {
          this.nodeMatch = JSON.parse(JSON.stringify(x));
        }
      });

      this.locations = JSON.parse(x.locations);
    });
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
    const transactionId = getTransactionIdentifier(data);

    // this.store.dispatch(
    //   EditGroupMatchCommand({
    //     fixtureStageId: this.data.group.fixtureStageId,
    //     groupId: this.data.group.id,
    //     match: data.match,
    //     tournamentId: this.data.tournamentId,
    //     transactionId,
    //   })
    // );

    // this.selectTransactionByIdSubscription = admingPopUpInComponent({
    //   dialog: this.dialog,
    //   store: this.store,
    //   TransactionDeletedEvent: TransactionResolvedEvent,
    //   selectTransactionById: selectTransactionById,
    //   transactionId,
    //   translateService: this.translateService,
    //   onSuccessAction: () => {
    //     this.dialogRef.close();
    //   },
    // });
  }
}
