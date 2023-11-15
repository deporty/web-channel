import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { TournamentEntity } from '@deporty-org/entities';
import { TOURNAMENT_STATUS_CODES } from 'src/app/app.constants';

@Component({
  selector: 'app-tournament-card-details',
  templateUrl: './tournament-card-details.component.html',
  styleUrls: ['./tournament-card-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentCardDetailsComponent implements OnInit {
  tournament!: TournamentEntity;
  status = TOURNAMENT_STATUS_CODES;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<TournamentCardDetailsComponent>
  ) {}

  getDisplay(status: string) {
    return this.status.filter((x) => x.value == status).pop()?.display;
  }

  ngOnInit(): void {
    this.tournament = this.data.tournament;
  }
}
