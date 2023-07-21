import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  MATCHES_STATUS_CODES,
  REGISTERED_TEAM_STATUS_CODES,
} from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { selectIntergroupMatchesByTournament } from 'src/app/features/tournaments/state-management/intergroup-matches/intergroup-matches.selector';
import {
  selectMatches,
  selectMatchesByTournament,
} from 'src/app/features/tournaments/state-management/matches/matches.selector';
import { selecRegisteredTeams } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-view-tournament-status',
  templateUrl: './view-tournament-status.component.html',
  styleUrls: ['./view-tournament-status.component.scss'],
})
export class ViewTournamentStatusComponent implements OnInit, OnDestroy {
  @Input('tournament-id') tournamentId!: Id;
  $registeredTeamsSubscription!: Subscription;
  $matchesSubscription!: Subscription;

  registeredTeamsData: any = null;
  matchesData: any = null;

  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.$registeredTeamsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getRegisteredTeamsData();
    this.getMatchesData();
  }

  getRegisteredTeamsData(): any {
    this.$registeredTeamsSubscription = this.store
      .select(selecRegisteredTeams)
      .pipe(
        filter((registeredTeams: RegisteredTeamEntity[] | undefined) => {
          return !!registeredTeams;
        }),
        map((registeredTeams: RegisteredTeamEntity[] | undefined) => {
          return registeredTeams!.reduce((prev: any, curr) => {
            if (!prev[curr.status]) {
              prev[curr.status] = 0;
            }
            prev[curr.status] = prev[curr.status] + 1;
            return prev;
          }, {});
        })
      )
      .subscribe((data) => {
        const labels = Object.keys(data).map((key) => {
          const temp = REGISTERED_TEAM_STATUS_CODES.filter(
            (t) => t.name === key
          );
          return temp.pop()?.display;
        });
        this.registeredTeamsData = {
          labels,
          data: Object.values(data),
        };
      });
  }

  getMatchesData() {

    const data = zip(
      this.store.select(selectIntergroupMatchesByTournament(this.tournamentId)),
      this.store.select(selectMatchesByTournament(this.tournamentId))
    );
    data
      .pipe(
        map(([intergroupMatches, groupMatches]) => {
          return [...intergroupMatches.map((x) => x.match), ...groupMatches];
        }),
        map((matches) => {
          return matches.reduce((acc: any, curr) => {
            if (!acc[curr.status]) {
              acc[curr.status] = 0;
            }
            acc[curr.status] = acc[curr.status] + 1;
            return acc;
          }, {});
        }),
        map((data) => {
          const labels = Object.keys(data).map((key) => {
            const temp = MATCHES_STATUS_CODES.filter(
              (matches) => matches.name === key
            );
            return temp.pop()?.display;
          });
          return {
            labels,
            data: Object.values(data),
          };
        })
      )
      .subscribe((data) => {
        this.matchesData = data;
      });
  }
}
