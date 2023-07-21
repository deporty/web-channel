import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlayerModel } from '@deporty-org/entities/players';


@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.scss'],
})
export class PlayersTableComponent implements OnInit {
  @Input() players!: IPlayerModel[];

  @Output() onSelectedPlayer = new EventEmitter();
  constructor() {
  }

  ngOnInit(): void {}
}
