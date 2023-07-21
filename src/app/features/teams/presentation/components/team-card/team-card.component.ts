import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamEntity } from '@deporty-org/entities/teams';
import { DEFAULT_SHIELD_IMG } from 'src/app/app.constants';
import { GeneralAction } from 'src/app/core/interfaces/general-action';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent implements OnInit {
  @Input() team!: TeamEntity;
  @Input('show-category') showCategory = true;
  @Input() options!: GeneralAction[];
  @Output() selectedOption = new EventEmitter();
  img!: string;
  constructor() {}
  emitSelectedOption(index: number) {
    this.options[index].handler(this.team);
    this.selectedOption.emit({
      index,
      team: this.team,
    });
  }
  ngOnInit(): void {
    this.img = this.team.shield || DEFAULT_SHIELD_IMG;
  }
}
