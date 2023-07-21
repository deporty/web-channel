import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Id } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { TeamEntity } from '@deporty-org/entities/teams';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetLocationByIdCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationById } from '../../../state-management/locations/locations.selector';

@Component({
  selector: 'app-match-summary-card',
  templateUrl: './match-summary-card.component.html',
  styleUrls: ['./match-summary-card.component.scss'],
})
export class MatchSummaryCardComponent implements OnInit {
  @Input() match!: MatchEntity | undefined;
  @Input() tag!: {
    tag: string;
    background: string;
    color: string;
  };

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

  constructor(private store: Store<AppState>) {
    this.editFlag = true;
    this.onEditMatch = new EventEmitter();

    this.deleteFlag = false;
    this.onDeleteMatch = new EventEmitter();

    this.viewFlag = false;
    this.onViewMatch = new EventEmitter();
  }

  ngOnInit(): void {
    if (this.match) {
      const teamA = this.store.select(selectTeamWithMembersById(this.match.teamAId));
      const teamB = this.store.select(selectTeamWithMembersById(this.match.teamBId));
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

      teamA.subscribe((t) => {
        if (t) {
          this.teamA = t.team;
        } else {
          if (!this.consultedTeamA) {
            this.consultedTeamA = true;
            this.store.dispatch(
              GetTeamByIdCommand({ teamId: this.match?.teamAId as Id })
            );
          }
        }
      });

      teamB.subscribe((t) => {
        if (t) {
          this.teamB = t.team;
        } else {
          if (!this.consultedTeamB) {
            this.consultedTeamB = true;

            this.store.dispatch(
              GetTeamByIdCommand({ teamId: this.match?.teamBId as Id })
            );
          }
        }
      });
    }

    if (this.match && !(this.match.status == 'completed')) {
    }
  }
}
