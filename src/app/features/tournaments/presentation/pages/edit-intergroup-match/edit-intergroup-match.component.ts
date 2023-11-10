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
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import {
  EditIntergroupMatchCommand,
  TransactionResolvedEvent,
} from '../../../state-management/intergroup-matches/intergroup-matches.actions';
import { selectTransactionById } from '../../../state-management/intergroup-matches/intergroup-matches.selector';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationByIds } from '../../../state-management/locations/locations.selector';
import {
  GetRegisteredUsersByMemberInsideTeamIdCommand
} from '../../../state-management/tournaments/tournaments.actions';
import {
  selectCurrentIntergroupMatch,
  selectTeamWithRegisteredMembers,
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
  $teamASuscription?: Subscription;
  $teamBSuscription?: Subscription;

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

  ngOnDestroy(): void {
    this.$teamASuscription?.unsubscribe();
    this.$teamBSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.data) {
      this.tournamentId = this.data.tournamentId;
      this.intergroupMatch = {
        match: this.data.match,
        fixtureStageId: this.data.fixtureStageId,
        id: this.data.id,
        teamAGroupId: '',
        teamBGroupId: '',
      };


      this.store.dispatch(
        GetRegisteredUsersByMemberInsideTeamIdCommand({
          teamId: this.intergroupMatch.match.teamAId!,
        })
      );
      this.store.dispatch(
        GetRegisteredUsersByMemberInsideTeamIdCommand({
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
      this.$teamASuscription = selectTeamWithRegisteredMembers(
        this.store,
        this.intergroupMatch.match.teamAId
      ).subscribe(([team, members]) => {
        this.teamA = {
          team: team,
          members: members,
        };
      });
      this.$teamBSuscription = selectTeamWithRegisteredMembers(
        this.store,
        this.intergroupMatch.match.teamBId
      ).subscribe(([team, members]) => {
        this.teamB = {
          team: team,
          members: members,
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
