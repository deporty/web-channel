import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FINANCIAL_STATUS_TYPE,
  Id,
  TournamentEntity,
} from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, merge } from 'rxjs';
import { debounceTime, filter, map, mergeMap } from 'rxjs/operators';
import { DEFAULT_TOURNAMENT_LAYOUT_IMG } from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';
import { GetTournamentLayoutByIdCommand } from 'src/app/features/organizations/organizations.commands';
import { selectTournamentLayoutById } from 'src/app/features/organizations/organizations.selector';
import {
  CalculateTournamentCostCommand,
  GetAllTournamentsCommand,
  ModifyTournamentFinancialStatusCommand,
  TransactionDeletedEvent,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import {
  selectAllTournaments,
  selectTransactionById,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';

@Component({
  templateUrl: './tournaments-financial-statements.component.html',
  styleUrls: ['./tournaments-financial-statements.component.scss'],
})
export class TournamentsFinancialStatementsComponent
  implements OnInit, OnDestroy
{
  static route = 'tournaments-financial-statements';

  $tournaments?: Subscription;
  tournaments: {
    tournament: TournamentEntity;
    tournamentLayout: TournamentLayoutEntity;
  }[];
  defaultImage = DEFAULT_TOURNAMENT_LAYOUT_IMG;
  options = FINANCIAL_STATUS_TYPE;
  statusMapper: any = {
    overdue: 'En mora',
    pending: 'Pendiente',
    paid: 'Pagado',
    'partial-paid': 'Parcialmente pagado',
  };
  tournamentStatus: any = {};
  selectTransactionByIdSubscription?: Subscription;

  img = '';

  constructor(
    private store: Store<AppState>,

    public dialog: MatDialog,
    private translateService: TranslateService,
    private external: ExternalResourcePipe
  ) {
    this.tournaments = [];
  }
  ngOnDestroy(): void {
    this.selectTransactionByIdSubscription?.unsubscribe();
  }

  calculatePrice(tournamentId: Id) {
    this.store.dispatch(
      CalculateTournamentCostCommand({
        tournamentId,
      })
    );
  }
  changeFinancialStatus(tournamentId: Id) {
    const transactionId = getTransactionIdentifier(tournamentId);

    this.store.dispatch(
      ModifyTournamentFinancialStatusCommand({
        tournamentId,
        financialStatus: this.tournamentStatus[tournamentId],
        transactionId,
      })
    );

    this.selectTransactionByIdSubscription = admingPopUpInComponent({
      dialog: this.dialog,
      selectTransactionById,
      store: this.store,
      TransactionDeletedEvent,
      transactionId,
      translateService: this.translateService,
    });
  }

  ngOnInit(): void {
    this.store.dispatch(GetAllTournamentsCommand());

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
        })
        // filter((tournamentsData) => {
        //   return ['pending', 'overdue'].includes(
        //     tournamentsData.tournament.financialStatements.status
        //   );
        // })
      )
      .subscribe((t) => {
        const exist = this.tournaments.findIndex(
          (x) => x.tournament.id == t.tournament.id
        );

        if (exist >= 0) {
          this.tournaments.splice(exist, 1, t);
        } else {
          this.tournaments.push(t);
        }

        const valueMap: any = {
          overdue: 4,
          pending: 3,
          'partial-pending': 2,
          paid: 1,
        };
        this.tournamentStatus = this.tournaments
          .sort((a, b) => {
            if (a.tournament.financialStatus && b.tournament.financialStatus) {
              const valueA = valueMap[a.tournament.financialStatus];
              const valueB = valueMap[b.tournament.financialStatus];

              return valueB - valueA;
            }
            return 0;
          })
          .reduce((acc: any, prev) => {
            acc[prev.tournament.id!] = prev.tournament.financialStatus;
            return acc;
          }, {});
      });
  }
}
