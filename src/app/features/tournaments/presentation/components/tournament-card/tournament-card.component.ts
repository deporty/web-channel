import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import {
  DEFAULT_TOURNAMENT_LAYOUT_IMG,
  TOURNAMENT_STATUS_CODES,
} from 'src/app/app.constants';

@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
})
export class TournamentCardComponent implements OnChanges {
  @Input() tournament!: TournamentEntity;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;

  img = DEFAULT_TOURNAMENT_LAYOUT_IMG;
  status = TOURNAMENT_STATUS_CODES;
  usingTournament = false;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (
        !this.usingTournament &&
        changes.tournamentLayout &&
        changes.tournamentLayout.currentValue &&
        changes.tournamentLayout.currentValue.flayer
      ) {
        this.img = changes.tournamentLayout.currentValue.flayer;
      }
      if (
        changes.tournament &&
        changes.tournament.currentValue &&
        changes.tournament.currentValue.flayer
      ) {
        this.usingTournament = true;
        this.img = changes.tournament.currentValue.flayer;
      }
    }
  }

  getDisplay(status: string) {
    return this.status.filter((x) => x.value == status).pop()?.display;
  }
}
