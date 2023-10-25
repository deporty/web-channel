import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  MATCHES_STATUS_CODES,
  REGISTERED_TEAM_STATUS_CODES,
} from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { GetCardsReportCommand } from 'src/app/features/organizations/organizations.commands';
import { selectCardsReportByTournamentId } from 'src/app/features/organizations/organizations.selector';
import { GetTeamByIdCommand, GetTeamsMembersCommand } from 'src/app/features/teams/state-management/teams.commands';
import {
  selectMemberById,
  selectTeamById,
} from 'src/app/features/teams/state-management/teams.selectors';
import { selectIntergroupMatchesByTournament } from 'src/app/features/tournaments/state-management/intergroup-matches/intergroup-matches.selector';
import {
  selectMatchesByTournament
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
  $cardsReporter!: Observable<any>;

  registeredTeamsData: any = null;
  matchesData: any = null;

  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.$registeredTeamsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getRegisteredTeamsData();
    this.getMatchesData();
    this.getCardsReport();
  }

  getCardsReport() {
    this.store.dispatch(
      GetCardsReportCommand({
        tournamentId: this.tournamentId,
      })
    );

    this.$cardsReporter = this.store
      .select(selectCardsReportByTournamentId(this.tournamentId))
      .pipe(
        filter((d) => {
          return !!d && d.length;
        }),
        mergeMap((items: any[]) => {
          for (const iterator of items) {
            this.store.dispatch(
              GetTeamByIdCommand({
                teamId: iterator.teamId,
              })
            );
            this.store.dispatch(
              GetTeamsMembersCommand({
                teamId: iterator.teamId,
              })
            );
          }

          const $teams = items.map((item) => {
           return this.store
              .select(selectTeamById(item.teamId))
              .pipe(filter((team) => !!team));
          });

          const $members = items.map((item) => {
           return this.store
              .select(selectMemberById(item.teamId, item.memberId))
              .pipe(filter((team) => !!team));
          });

          return zip(of(items), zip(...$teams), zip(...$members));
        }),
        map(([items,teams,users]) => {
          const res = [];
          return items.map((i) => {
            console.log({
              ...i,
              team: teams.filter((u) => u.id == i.teamId)[0],
              user: users.filter((u) => u!.member.id == i.memberId)[0],
            });
            
            return {
              ...i,
              team: teams.filter((u) => u.id == i.teamId)[0],
              user: users.filter((u) => u!.member.id == i.memberId)[0]!.user,
            };
          });
        })
      );

    this.$cardsReporter.subscribe((a) => {
      console.log('----', a);
    });
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
