import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities/general';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, zip } from 'rxjs';
import AppState from 'src/app/app.state';
import {
  GetCurrentTournamentsCommand,
  GetTournamentsByFiltersCommand,
} from '../../../state-management/tournaments/tournaments.actions';
import { selectAllTournaments } from '../../../state-management/tournaments/tournaments.selector';

import {
  debounceTime,
  filter,
  first,
  map,
  mergeMap,
  timeout,
} from 'rxjs/operators';
import {
  GetOrganizationsCommand,
  GetTournamentLayoutByIdCommand,
} from 'src/app/features/organizations/organizations.commands';
import {
  selectOrganizations,
  selectTournamentLayoutById,
} from 'src/app/features/organizations/organizations.selector';
import COPA_CIUDAD_MANIZALES from '../../../../news/infrastructure/ciudad-manizales';
import DEFAULT_NEW from '../../../../news/infrastructure/default-new';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';
import { OrganizationListComponent } from '../organization-list/organization-list.component';
import { CATEGORIES } from 'src/app/app.constants';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-current-tournament-list',
  templateUrl: './current-tournament-list.component.html',
  styleUrls: ['./current-tournament-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentTournamentListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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

  filters: { display: string; property: string; values?: any[] }[];
  $organizations: any;
  $organizationsSuscription?: Subscription;
  mode = 'current';
  historyTournaments?: {
    tournament: TournamentEntity;
    tournamentLayout: TournamentLayoutEntity;
  }[];
  currentFilters: any;
  isSmall: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    this.isSmall = false;
    this.filters = [
      {
        display: 'Organización',
        property: 'organizationId',
        values: [],
      },
      {
        display: 'Año',
        property: 'year',
        values: [
          {
            value: null,
            display: '',
          },
          {
            value: 2022,
            display: '2022',
          },
          {
            value: 2023,
            display: '2023',
          },
        ],
      },
      {
        display: 'Categoría',
        property: 'category',
        values: [
          {
            value: null,
            display: '',
          },
          ...CATEGORIES.map((x) => ({ value: x, display: x })),
        ],
      },
    ];
  }
  ngOnDestroy(): void {
    this.$organizationsSuscription?.unsubscribe();
  }

  onSearch() {
    this.mode = 'history';
    if (Object.keys(this.currentFilters).length > 0) {
      this.store.dispatch(
        GetTournamentsByFiltersCommand({
          filters: this.currentFilters,
        })
      );
    }
  }
  onUpdateFilters(data: any) {
    this.currentFilters = data;
  }
  onClear() {
    this.mode = 'current';
  }

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
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          this.isSmall = true;
        } else if (state.breakpoints[Breakpoints.Small]) {
          this.isSmall = true;
        } else if (state.breakpoints[Breakpoints.Medium]) {
          this.isSmall = false;
        } else if (state.breakpoints[Breakpoints.Large]) {
          this.isSmall = false;
        } else if (state.breakpoints[Breakpoints.XLarge]) {
          this.isSmall = false;
        }
        this.cdr.detectChanges();
      });

    this.store.dispatch(
      GetOrganizationsCommand({
        pageNumber: 0,
        pageSize: 100,
      })
    );
    this.$organizations = this.store.select(selectOrganizations).pipe(
      first((x) => {
        return !!x && Object.keys(x).length > 0;
      })
    );

    this.$organizationsSuscription = this.$organizations.subscribe(
      (data: any) => {
        const values = Object.values(data)
          .filter((x: any) => {
            return x.status == 'active';
          })
          .map((x: any) => {
            return {
              display: x.name,
              value: x.id,
            };
          });
        this.filters[0].values = [
          {
            value: null,
            display: '',
          },

          ...values,
        ];
      }
    );

    this.store.dispatch(GetCurrentTournamentsCommand());
    setTimeout(() => {
      if (!this.tournaments) {
        this.tournaments = [];
      }
    }, 6000);

    this.$tournaments = this.store.select(selectAllTournaments).pipe(
      filter((tournaments) => {
        return !!tournaments && tournaments.length > 0;
      }),

      mergeMap((tournaments: TournamentEntity[]) => {
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
      // filter((tournaments) => {
      //   return (
          
      //     JSON.stringify(tournaments) != JSON.stringify(this.tournaments)
      //   );
      // })
    );

    this.$tournaments.subscribe((tournaments) => {
      console.log('No hay nada');
      console.log(tournaments);
      
      
      this.tournaments = tournaments.filter((item) => {
        return ['running', 'check-in'].includes(item.tournament.status);
      });

      if (this.mode == 'history') {
        this.historyTournaments = tournaments
          .filter((item) => {
            return !['draft', 'deleted'].includes(item.tournament.status);
          })
          .filter((item) => {
            const entries = Object.entries(this.currentFilters);
            return entries.reduce((acc, entry) => {
              return (item.tournament as any)[entry[0]] == entry[1] && acc;
            }, true);
          });

          console.log(this.historyTournaments,45);
          
      }
      this.cdr.detectChanges();
    });
  }
}
