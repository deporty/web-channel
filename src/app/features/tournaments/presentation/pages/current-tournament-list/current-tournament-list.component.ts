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

import { debounceTime, filter, map, mergeMap } from 'rxjs/operators';
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
  tournaments!: {
    tournament: TournamentEntity;
    tournamentLayout: TournamentLayoutEntity;
  }[];
  newPost = DEFAULT_NEW;
  ciudadManizales = COPA_CIUDAD_MANIZALES;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.store.dispatch(GetCurrentTournamentsCommand());

    this.$tournaments = this.store.select(selectAllTournaments).pipe(
      filter((tournaments) => {
        return !!tournaments && tournaments.length > 0;
      }),
      debounceTime(1000),
      mergeMap((tournaments: TournamentEntity[]) => {
        console.log(tournaments, 788978);

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
      })
    );

    this.$tournaments.subscribe((tournaments) => {
      if (!this.tournaments) {
        this.tournaments = tournaments;
      } else {
        if (JSON.stringify(this.tournaments) != JSON.stringify(tournaments)) {
          this.tournaments = tournaments;
        }
      }
    });
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
}
