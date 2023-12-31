import { Component, Input, OnInit } from '@angular/core';
import { Id, TeamEntity } from '@deporty-org/entities';
import {
  DEFAULT_STADISTICS_ORDER,
  StadistisKind,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import {
  FlatPointsStadistics,
  PointsStadistics,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-position-table-card',
  templateUrl: './position-table-card.component.html',
  styleUrls: ['./position-table-card.component.scss'],
})
export class PositionTableCardComponent implements OnInit {
  @Input() results!: PositionsTable;
  @Input() teams!: { [teamId: Id]: Observable<TeamEntity | undefined> };
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;

  data: any;
  orderToUse: StadistisKind[];

  constructor() {
    this.orderToUse = DEFAULT_STADISTICS_ORDER;
  }
  stadisticMap: {
    [index: string]: {
      tooltip: string;
      display: string;

      decoration: boolean;
      property: string;
    };
  } = {
    P: {
      tooltip: 'Puntos',
      display: 'P',
      decoration: true,
      property: 'points',
    },
    PM: {
      tooltip: 'Partidos Jugados',
      display: 'PJ',

      decoration: false,
      property: 'playedMatches',
    },
    LM: {
      tooltip: 'Partidos Perdidos',
      display: 'PP',

      decoration: false,
      property: 'lostMatches',
    },
    WM: {
      tooltip: 'Partidos Ganados',
      display: 'PG',

      decoration: false,
      property: 'wonMatches',
    },
    TM: {
      tooltip: 'Partidos Empatados',
      display: 'PE',

      decoration: false,
      property: 'tiedMatches',
    },
    GIF: {
      tooltip: 'Goles a Favor',
      display: 'GF',

      decoration: false,
      property: 'goalsInFavor',
    },
    GA: {
      tooltip: 'Goles en contra',
      display: 'GC',

      decoration: false,
      property: 'goalsAgainst',
    },
    GD: {
      tooltip: 'Goles diferencia',
      display: 'GD',

      decoration: false,
      property: 'goalsDifference',
    },
    FP: {
      tooltip: 'Juego Limpio',
      display: 'JL',
      decoration: false,
      property: 'fairPlay',
    },
    LDF: {
      tooltip: 'Valla menos vencida',
      display: 'VMV',

      decoration: false,
      property: 'goalsAgainstPerMatch',
    },
  };

  ngOnInit(): void {
    if (
      this.tournamentLayout &&
      this.tournamentLayout.fixtureStagesConfiguration?.stadisticsOrder
    ) {
      this.orderToUse =
        this.tournamentLayout.fixtureStagesConfiguration?.stadisticsOrder;
    }
    this.data = this.results.table as any;
  }
}
