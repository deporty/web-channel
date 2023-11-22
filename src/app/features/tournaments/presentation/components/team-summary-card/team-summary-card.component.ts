import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TeamEntity } from '@deporty-org/entities';
import { DEFAULT_SHIELD_IMG } from 'src/app/app.constants';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';

@Component({
  selector: 'app-team-summary-card',
  templateUrl: './team-summary-card.component.html',
  styleUrls: ['./team-summary-card.component.scss'],
})
export class TeamSummaryCardComponent implements OnInit, OnChanges {
  @Input() team!: TeamEntity | undefined | null;
  @Input('show-category') showCategory = true;
  img!: string;
  constructor(private externalResourcePipe: ExternalResourcePipe) {
    this.img = DEFAULT_SHIELD_IMG;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.team && changes.team.currentValue) {
        if (this.team!.miniShield) {
          this.img = this.externalResourcePipe.transform(this.team!.miniShield);
        }
      }
    }
  }
}
