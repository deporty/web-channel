import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities/general';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetCurrentTournamentsCommand } from '../../../state-management/tournaments/tournaments.actions';
import { selectAllTournaments } from '../../../state-management/tournaments/tournaments.selector';

import { debounceTime, filter, map, mergeMap, timeout } from 'rxjs/operators';
import { GetTournamentLayoutByIdCommand } from 'src/app/features/organizations/organizations.commands';
import { selectTournamentLayoutById } from 'src/app/features/organizations/organizations.selector';
import COPA_CIUDAD_MANIZALES from '../../../../news/infrastructure/ciudad-manizales';
import DEFAULT_NEW from '../../../../news/infrastructure/default-new';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';
import { OrganizationListComponent } from '../organization-list/organization-list.component';
@Component({
  selector: 'app-current-tournament-list',
  templateUrl: './current-tournament-list.component.html',
  styleUrls: ['./current-tournament-list.component.scss'],
})
export class CurrentTournamentListComponent implements OnInit, AfterViewInit {
  static route = 'current-tournament-list';

  $tournaments!: Observable<
    { tournament: TournamentEntity; tournamentLayout: TournamentLayoutEntity }[]
  >;
  ciudadManizales = COPA_CIUDAD_MANIZALES;
  newPost = DEFAULT_NEW;
  tournaments!: {
    tournament: TournamentEntity;
    tournamentLayout: TournamentLayoutEntity;
  }[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  consult() {
    this.router.navigate([OrganizationListComponent.route], {
      relativeTo: this.activatedRoute,
    });
  }

  goToTournamentDetail(id: Id) {
    this.router.navigate([TournamentDetailComponent.route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        tournamentId: id,
      },
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.store.dispatch(GetCurrentTournamentsCommand());

    this.$tournaments = this.store.select(selectAllTournaments).pipe(
      filter((tournaments) => {
        return !!tournaments && tournaments.length > 0;
      }),

      debounceTime(1000),
      timeout(6000),
      mergeMap((tournaments: TournamentEntity[]) => {
        console.log('LLego ');

        return tournaments.length > 0
          ? zip(
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
            )
          : of([]);
      }),
      filter((tournaments) => {
        return JSON.stringify(tournaments) != JSON.stringify(this.tournaments);
      }),
      map((data) => {
        return data.filter((item) => {
          return ['running', 'check-in'].includes(item.tournament.status);
        });
      })
    );

    this.$tournaments.subscribe(
      (tournaments) => {
        this.tournaments = tournaments;
      },
      () => {
        this.tournaments = [];
      }
    );
  }
}
