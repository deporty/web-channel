import { Component, Input, OnInit } from '@angular/core';
import { Id, TeamEntity } from '@deporty-org/entities';
import { PointsStadistics, PositionsTable } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-position-table-card',
  templateUrl: './position-table-card.component.html',
  styleUrls: ['./position-table-card.component.scss'],
})
export class PositionTableCardComponent implements OnInit {
  @Input() results!: PositionsTable;
  @Input() teams!: { [teamId: Id]: Observable<TeamEntity | undefined> };
  constructor() {}

  ngOnInit(): void {}
}
