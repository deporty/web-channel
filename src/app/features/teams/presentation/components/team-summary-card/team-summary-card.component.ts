import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamEntity } from '@deporty-org/entities/teams';
import { DEFAULT_SHIELD_IMG } from 'src/app/app.constants';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';

@Component({
  selector: 'app-team-summary-basic-card',
  templateUrl: './team-summary-card.component.html',
  styleUrls: ['./team-summary-card.component.scss'],
})
export class TeamSummaryBasicCardComponent implements OnInit {
  img!: string;
  @Input() team!: TeamEntity;
  @Input() options!: GeneralAction[];
  @Output() selectedOption = new EventEmitter();

  constructor(private externalResourcePipe: ExternalResourcePipe) {}

  ngOnInit(): void {
    this.img = this.externalResourcePipe.transform(this.team.miniShield) || DEFAULT_SHIELD_IMG;
  }

  emitSelectedOption(index: number) {
    this.options[index].handler(this.team);
    this.selectedOption.emit({
      index,
      team: this.team,
    });
  }
}
