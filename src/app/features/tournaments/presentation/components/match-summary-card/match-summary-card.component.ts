import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { LocationEntity } from '@deporty-org/entities/locations';
import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import {
  selectTeamById
} from 'src/app/features/teams/state-management/teams.selectors';
import { GetLocationByIdCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationById } from '../../../state-management/locations/locations.selector';
import { selecRegisteredMembersByTeam } from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-match-summary-card',
  templateUrl: './match-summary-card.component.html',
  styleUrls: ['./match-summary-card.component.scss'],
})
export class MatchSummaryCardComponent implements OnInit, OnDestroy {
  @Input() match!: MatchEntity | undefined;
  @Input() tag!:
    | {
        tag: string;
        background: string;
        color: string;
      }
    | undefined;

  @Input('edit-flag') editFlag: boolean;
  @Output('on-edit-match') onEditMatch: EventEmitter<boolean>;

  @Input('delete-flag') deleteFlag: boolean;
  @Output('on-delete-match') onDeleteMatch: EventEmitter<boolean>;

  @Input('view-flag') viewFlag: boolean;
  @Output('on-view-match') onViewMatch: EventEmitter<boolean>;

  teamA!: TeamEntity;
  teamB!: TeamEntity;

  consultedTeamA = false;
  consultedTeamB = false;
  location!: LocationEntity;
  $teamBSuscription!: Subscription;
  $teamASuscription!: Subscription;

  constructor(private store: Store<AppState>) {
    this.editFlag = true;
    this.onEditMatch = new EventEmitter();

    this.deleteFlag = false;
    this.onDeleteMatch = new EventEmitter();

    this.viewFlag = false;
    this.onViewMatch = new EventEmitter();
  }
  ngOnDestroy(): void {
    this.$teamASuscription.unsubscribe();
    this.$teamBSuscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.match) {
      const teamA = zip(
        this.store
          .select(selectTeamById(this.match.teamAId))
          .pipe(filter((f) => !!f)),
        this.store.select(selecRegisteredMembersByTeam(this.match.teamAId))
      ).pipe(
        map(([team, members]: [TeamEntity, MemberEntity[] | undefined]) => {
          return {
            team: team,
            members: members,
          };
        })
      );
      const teamB = zip(
        this.store
          .select(selectTeamById(this.match.teamBId))
          .pipe(filter((f) => !!f)),
        this.store.select(selecRegisteredMembersByTeam(this.match.teamBId))
      ).pipe(
        map(([team, members]: [TeamEntity, MemberEntity[] | undefined]) => {
          return {
            team: team,
            members: members,
          };
        })
      );
      if (this.match.locationId) {
        this.store.dispatch(
          GetLocationByIdCommand({
            locationId: this.match.locationId!,
          })
        );
        this.store
          .select(selectLocationById(this.match.locationId))
          .subscribe((x) => {
            if (x) {
              this.location = x;
            }
          });
      }

      this.$teamASuscription = teamA.subscribe((t) => {
        this.teamA = t.team;
      });

      this.$teamBSuscription = teamB.subscribe((t) => {
        this.teamB = t.team;
      });
    }

   
  }
}
