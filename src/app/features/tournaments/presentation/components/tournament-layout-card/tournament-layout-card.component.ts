import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { DEFAULT_TOURNAMENT_LAYOUT_IMG } from 'src/app/app.constants';

@Component({
  selector: 'app-tournament-layout-card',
  templateUrl: './tournament-layout-card.component.html',
  styleUrls: ['./tournament-layout-card.component.scss'],
})
export class TournamentLayoutCardComponent implements OnChanges {
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;
  @Input() organization!: OrganizationEntity;
  img = DEFAULT_TOURNAMENT_LAYOUT_IMG;
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tournamentLayout.currentValue.flayer) {
      this.img = changes.tournamentLayout.currentValue.flayer;
    }
  }
}
