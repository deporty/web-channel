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
import { MemberEntity, TeamEntity } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import {
  IntergroupMatchEntity,
  TournamentEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import {
  GetTeamByIdCommand,
  GetTeamsMembersCommand,
} from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import {
  EditIntergroupMatchCommand,
  TransactionResolvedEvent,
} from '../../../state-management/intergroup-matches/intergroup-matches.actions';
import { selectTransactionById } from '../../../state-management/intergroup-matches/intergroup-matches.selector';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationByIds } from '../../../state-management/locations/locations.selector';
import { GetTournamentByIdCommand } from '../../../state-management/tournaments/tournaments.actions';
import {
  selectCurrentIntergroupMatch,
  selectTournamentById,
} from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-edit-intergroup-match',
  templateUrl: './edit-intergroup-match.component.html',
  styleUrls: ['./edit-intergroup-match.component.scss'],
})
export class EditIntergroupMatchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  meta!: any;

  intergroupMatch!: IntergroupMatchEntity;

  intergroupMatchId!: string;
  tournamentId!: string;

  locations: Array<LocationEntity>;

  $selectMatch: Observable<IntergroupMatchEntity | undefined>;
  date: Date | undefined;
  stageId!: string;

  teamA!: { team: TeamEntity; members: MemberEntity[] };
  teamB!: { team: TeamEntity; members: MemberEntity[] };

  selectTransactionByIdSubscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<EditIntergroupMatchComponent>,

    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private store: Store<AppState>
  ) {
    this.$selectMatch = this.store.select(selectCurrentIntergroupMatch);

    this.locations = [];
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    if (this.data) {
      this.tournamentId = this.data.tournamentId;
      this.intergroupMatch = {
        match: this.data.match,
        fixtureStageId: this.data.fixtureStageId,
        id: this.data.id,
      };

      this.store.dispatch(
        GetTournamentByIdCommand({
          tournamentId: this.data.tournamentId,
        })
      );
      this.store.dispatch(
        GetTeamByIdCommand({
          teamId: this.intergroupMatch.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetTeamByIdCommand({
          teamId: this.intergroupMatch.match.teamBId!,
        })
      );
      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: this.intergroupMatch.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: this.intergroupMatch.match.teamBId!,
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
          }
        });
      this.store
        .select(selectTeamWithMembersById(this.intergroupMatch.match.teamAId))
        .subscribe((teamA) => {
          if (teamA)
            this.teamA = {
              team: teamA.team,
              members: Object.values(teamA.members),
            };
        });
      this.store
        .select(selectTeamWithMembersById(this.intergroupMatch.match.teamBId))
        .subscribe((teamB) => {
          if (teamB)
            this.teamB = {
              team: teamB.team,
              members: Object.values(teamB.members),
            };
        });

      this.meta = {
        tournamentId: this.tournamentId,
      };
    }
  }

  saveData(data: any) {

    const transactionId = getTransactionIdentifier(data);

    this.store.dispatch(
      EditIntergroupMatchCommand({
        intergroupMatch: {
          ...this.intergroupMatch,
          match: data.match,
        },
        tournamentId: this.tournamentId,
        fixtureStageId: this.intergroupMatch.fixtureStageId,
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
