import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities/general';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import {
  getCurrentGeolocation,
  trackEvent
} from 'src/app/core/helpers/log-events.helper';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';
import { TournamentListComponent } from '../tournament-list/tournament-list.component';

@Component({
  selector: 'app-index-tournament',
  templateUrl: './index-tournament.component.html',
  styleUrls: ['./index-tournament.component.scss'],
})
export class CurrentTournamentComponent implements OnInit {
  static route = 'index-tournament';

  body: any;

  tournament!: TournamentEntity;
  $tournaments!: Observable<IBaseResponse<TournamentEntity[]>>;

  tournaments!: TournamentEntity[];

  news = [
    {
      title: 'Fecha 5',
      start: new Date(2022, 4, 21, 10, 33, 30, 0),
      end: new Date(2022, 4, 22, 10, 33, 30, 0),
      // end: new Date('24/04/2022'),
      img: 'assets/dates/05.jpeg',
    },

    {
      title: 'Fecha 4',
      start: new Date(2022, 4, 14, 10, 33, 30, 0),
      end: new Date(2022, 4, 15, 10, 33, 30, 0),
      // end: new Date('24/04/2022'),
      img: 'assets/dates/04.png',
    },
    {
      title: 'Fecha 3',
      start: new Date(2022, 4, 7, 10, 33, 30, 0),
      end: new Date(2022, 4, 8, 10, 33, 30, 0),
      // end: new Date('24/04/2022'),
      img: 'assets/dates/03.png',
    },
    {
      title: 'Fecha 2',
      start: new Date(2022, 3, 30, 10, 33, 30, 0),
      end: new Date(2022, 4, 1, 10, 33, 30, 0),
      // end: new Date('24/04/2022'),
      img: 'assets/dates/02.png',
    },
    {
      title: 'Fecha 1',
      start: new Date(2022, 3, 23, 10, 33, 30, 0),
      end: new Date(2022, 3, 24, 10, 33, 30, 0),
      // end: new Date('24/04/2022'),
      img: 'assets/dates/01.png',
    },
  ];
  constructor(
    private tournamentService: TournamentAdapter,

    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.body = {
      children: [
        {
          component: 'app-header',
          data: {
            title: 'Torneo B2 (2021) en finales',
            subtitle: '12-05-2022',
          },
          children: [],
        },
        {
          component: 'app-paragraph',
          data: {
            text: `
                  Después de grandes esfuerzos y una lucha y competencia, este sábado en el conjunto deportivo de Marchagas se celebrará
                  los encuentros finales del Vigésimo noveno Torneo Categoria B2
                  `,
            img: 'assets/ads/add-01.png',
            'img-position': 'top',
            subtitle: '',
          },
          children: [],
        },
      ],
    };
  }

  ngOnInit(): void {
    getCurrentGeolocation().subscribe((data) => {
      trackEvent('tournaments_views', {
        date: data.date,
        timestamp: data.timestamp,
      });
    });

    // this.$tournaments = this.tournamentService.getAllSummaryTournaments();
    // this.$tournaments.subscribe((data: IBaseResponse<TournamentEntity[]>) => {
    //   this.tournaments = data.data;
    // });
  }

  goToTournamentDetail(id: string) {
    this.router.navigate([TournamentDetailComponent.route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        id,
      },
    });
  }

  seeTournaments() {
    this.router.navigate([TournamentListComponent.route], {
      relativeTo: this.activatedRoute,
    });
  }
}
