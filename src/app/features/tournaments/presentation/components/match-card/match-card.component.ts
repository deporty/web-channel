import { Component, Input, OnInit } from '@angular/core';
import { MatchEntity } from '@deporty-org/entities/tournaments';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss']
})
export class MatchCardComponent implements OnInit {

  @Input() match!: MatchEntity;
  constructor() { }

  ngOnInit(): void {
  }

}
