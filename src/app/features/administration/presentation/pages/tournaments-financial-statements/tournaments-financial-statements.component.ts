import { Component, OnInit } from '@angular/core';
import { Id, TournamentEntity } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { Observable, Subscription, concat, from, merge, of, zip } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  mergeAll,
  mergeMap,
  tap,
} from 'rxjs/operators';
import {
  DEFAULT_ORGANIZATION_IMG,
  DEFAULT_TOURNAMENT_LAYOUT_IMG,
} from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { GetTournamentLayoutByIdCommand } from 'src/app/features/organizations/organizations.commands';
import { selectTournamentLayoutById } from 'src/app/features/organizations/organizations.selector';
import {
  CalculateTournamentCostCommand,
  GetCurrentTournamentsCommand,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectAllTournaments } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';

@Component({
  templateUrl: './tournaments-financial-statements.component.html',
  styleUrls: ['./tournaments-financial-statements.component.scss'],
})
export class TournamentsFinancialStatementsComponent implements OnInit {
  $tournaments?: Subscription;
  tournaments: {
    tournament: TournamentEntity;
    tournamentLayout: TournamentLayoutEntity;
  }[];
  defaultImage = DEFAULT_TOURNAMENT_LAYOUT_IMG;

  statusMapper = {
    overdue: 'En mora',
    pending: 'Pendiente',
  };
  constructor(private store: Store<AppState>) {
    this.tournaments = [];
  }

  calculatePrice(tournamentId: Id) {
    this.store.dispatch(
      CalculateTournamentCostCommand({
        tournamentId,
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(GetCurrentTournamentsCommand());

    this.$tournaments = this.store
      .select(selectAllTournaments)
      .pipe(
        mergeMap((tournaments: TournamentEntity[]) => {
          return merge(
            ...tournaments.map((x) => {
              this.store.dispatch(
                GetTournamentLayoutByIdCommand({
                  organizationId: x.organizationId,
                  tournamentLayoutId: x.tournamentLayoutId,
                })
              );

              return this.store
                .select(selectTournamentLayoutById(x.tournamentLayoutId))
                .pipe(
                  map((d) => {
                    return {
                      tournament: x,
                      tournamentLayout: d,
                    };
                  }),
                  filter((data) => {
                    return !!data.tournament && !!data.tournamentLayout;
                  }),
                  debounceTime(100)
                );
            })
          );
        }),
        filter((tournamentsData) => {
          return (
            this.tournaments.filter(
              (x) =>
                x.tournament.id == tournamentsData.tournament.id &&
                JSON.stringify(x.tournament) ==
                  JSON.stringify(tournamentsData.tournament)
            ).length == 0
          );
        }),
        filter((tournamentsData) => {
          return ['pending', 'overdue'].includes(
            tournamentsData.tournament.financialStatements.status
          );
        })
      )
      .subscribe((t) => {
        const exist = this.tournaments.findIndex(
          (x) => x.tournament.id == t.tournament.id
        );

        if (exist >= 0) {
          this.tournaments.splice(exist, 1);
        }
        this.tournaments.push(t);
        console.log(t);
        
        console.log(this.tournaments);
      });
  }
}
