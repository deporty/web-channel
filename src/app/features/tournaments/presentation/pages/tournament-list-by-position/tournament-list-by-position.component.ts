import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities/general';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';
import {
  GetTournamentsByOrganizationAndTournamentLayoutCommand,
  GetTournamentByIdCommand,
  GetTournamentByPositionCommand,
} from '../../../state-management/tournaments/tournaments.actions';
import {
  selectTournaments,
  selectTournamentsByOrganizationAndLayout,
} from '../../../state-management/tournaments/tournaments.selector';

import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';
import { getCurrentGeolocation } from 'src/app/core/helpers/log-events.helper';

@Component({
  selector: 'app-tournament-list-by-position',
  templateUrl: './tournament-list-by-position.component.html',
  styleUrls: ['./tournament-list-by-position.component.scss'],
})
export class TournamentListByPositionComponent implements OnInit {
  static route = 'tournament-list-by-position';
  $tournaments!: Observable<TournamentEntity[]>;
  tournaments!: TournamentEntity[];

  ratio = 8;

  filters: { display: string; property: string }[];
  menuOptions: {
    display: string;
    background: string;
    color: string;
    enable: () => boolean;
    handler: () => void;
    icon: string;
    identifier: string;
  }[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.filters = [
      {
        display: 'Nombre',
        property: 'name',
      },
      {
        display: 'Año',
        property: 'category',
      },
      {
        display: 'Etiquetas',
        property: 'category',
      },
    ];

    this.menuOptions = [
      {
        display: 'Crear Torneo',
        background: 'white',
        color: 'red',
        enable: () => true,
        handler: () => {},
        icon: 'add',
        identifier: 'akf;alfa',
      },
    ];
  }

  ngOnInit(): void {
    this.$tournaments = this.store.select(
      selectTournamentsByOrganizationAndLayout(
        'Wsib20rGNlTR2UsU42eY',
        '155b473c8db7486f995d'
      )
    );
    getCurrentGeolocation().subscribe(() => {
      this.store.dispatch(
        GetTournamentByPositionCommand({
          ratio: this.ratio,
          position: {
            latitude: 5,
            longitude: 4,
          },
        })
      );
    });
  }

  goToTournamentDetail(id: string | undefined) {
    this.router.navigate([TournamentDetailComponent.route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        id,
      },
    });
  }

  onChangeRatio() {}

  formatLabel(value: number): string {
    return `${value}Km`;
  }
  onClear() {}
}
