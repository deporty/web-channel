import { debounceTime, first } from 'rxjs/operators';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
const moment = require('moment');

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, zip } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import {
  MATCHES_STATUS_CODES,
  REGISTERED_TEAM_STATUS_CODES
} from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { GetCardsReportCommand } from 'src/app/features/organizations/organizations.commands';
import { selectCardsReportByTournamentId } from 'src/app/features/organizations/organizations.selector';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { selectIntergroupMatchesByTournament } from 'src/app/features/tournaments/state-management/intergroup-matches/intergroup-matches.selector';
import { selectMainDrawByTournamentId } from 'src/app/features/tournaments/state-management/main-draw/main-draw.selector';
import { selectMatchesByTournament } from 'src/app/features/tournaments/state-management/matches/matches.selector';
import {
  selecRegisteredMembersByTeamAndMemberId,
  selecRegisteredTeams,
  selectTournamentById
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';

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
  dateSelected: any;
  dateSelectedKey: any;

  currentTeamsByDate: any[] = [];
  formattedCardsReport: any = {};
  selectKeys!: string[];
  tournament: any;
  $tournamentSuscription!: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.$registeredTeamsSubscription?.unsubscribe();
    this.$tournamentSuscription?.unsubscribe();
    this.selectKeys = [];
    this.formattedCardsReport = {};
  }

  ngOnInit(): void {
    this.$tournamentSuscription = this.store
      .select(selectTournamentById(this.tournamentId))
      .subscribe((data) => {
        this.tournament = data;
      });

    this.getRegisteredTeamsData();
    this.getMatchesData();
    this.getCardsReport();
  }
  updateDateKey(date: any) {
    this.currentTeamsByDate = [];
    this.dateSelectedKey = date.value;
    if (this.dateSelectedKey in this.formattedCardsReport) {
      this.currentTeamsByDate = this.formattedCardsReport[this.dateSelectedKey];
    }
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
          return !!d;
        }),
        mergeMap((items: any) => {
          console.log('Cards report ', items);

          const dateEntries = Object.entries(items);
          this.selectKeys = dateEntries.map((key) => key[0]);
          const $teams = [];
          const $members = [];
          for (const dateEntry of dateEntries) {
            const teamObject: any = dateEntry[1];
            const teamIds = Object.keys(teamObject);
            for (const teamId of teamIds) {
              $teams.push(
                this.store
                  .select(selectTeamById(teamId))
                  .pipe(filter((team) => !!team))
              );

              const groupedMembers: any = teamObject[teamId];

              for (const member of groupedMembers) {

                $members.push(
                  this.store
                    .select(
                      selecRegisteredMembersByTeamAndMemberId(
                        teamId,
                        member.memberId
                      )
                    )
                    .pipe(
                      debounceTime(1000),
                      tap((team) => {
                      }),
                      filter((team) => !!team),

                      mergeMap((ty) => {
                        // console.log('Tirando ', ty);
                        this.store.dispatch(
                          GetUserByIdCommand({
                            id: ty!.userId,
                            transactionId: ty!.userId,
                          })
                        );
                        return this.store
                          .select(selectUserById(ty!.userId))
                          .pipe(filter((J) => !!J))
                          .pipe(
                            map((user) => {
                              return { user, member: ty! };
                            })
                          );
                      })
                    )
                );
              }
            }
          }
          return zip(of(items), zip(...$teams), zip(...$members));
        }),
        map(([items, teams, users]) => {
          const dateEntries = Object.entries(items);
          const formattedCardsReport: any = {};

          for (const dateEntry of dateEntries) {
            const ISODate = dateEntry[0];
            const teamObject: any = dateEntry[1];
            const teamIds = Object.keys(teamObject);
            formattedCardsReport[ISODate] = [];
            for (const teamId of teamIds) {
              const teamData = teams.filter((t) => t.id == teamId)[0];
              const groupedMembers: any = teamObject[teamId];
              const r = {
                team: teamData,
                members: [],
              };
              for (const gm of groupedMembers) {
                (r['members'] as any).push({
                  ...gm,
                  user: users.filter((u) => u!.member.id == gm.memberId)[0],
                });
              }

              formattedCardsReport[ISODate].push(r);
            }
          }

          return formattedCardsReport;
        })
      );

    this.$cardsReporter.subscribe((data) => {
      this.formattedCardsReport = data;
      const firsKey = Object.keys(data);

      if (firsKey.length > 0) {
        this.dateSelectedKey = firsKey[0];
        if (this.dateSelectedKey in this.formattedCardsReport) {
          this.currentTeamsByDate =
            this.formattedCardsReport[this.dateSelectedKey];
        }
      }
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
          return {
            registeredTeams,
            data: registeredTeams!.reduce((prev: any, curr) => {
              if (!prev[curr.status]) {
                prev[curr.status] = 0;
              }
              prev[curr.status] = prev[curr.status] + 1;
              return prev;
            }, {}),
          };
        })
      )
      .subscribe((value) => {
        const data = value.data;

        const registeredTeams = value.registeredTeams;

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
      this.store.select(selectMainDrawByTournamentId(this.tournamentId)),
      this.store.select(selectIntergroupMatchesByTournament(this.tournamentId)),
      this.store.select(selectMatchesByTournament(this.tournamentId))
    );
    data
      .pipe(
        map(([mainDrawMatches, intergroupMatches, groupMatches]) => {
          return [
            ...(mainDrawMatches ? mainDrawMatches!.map((x) => x.match) : []),
            ...intergroupMatches.map((x) => x.match),
            ...groupMatches,
          ];
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
