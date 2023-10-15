import { Component, Input, OnInit } from '@angular/core';
import { IPlayerModel } from '@deporty-org/entities/players';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities/teams';
import { DEFAULT_PROFILE_IMG } from 'src/app/app.constants';
import { POSITION_MAPPER } from '../../../constants';

@Component({
  selector: 'app-member-summary-card',
  templateUrl: './member-summary-card.component.html',
  styleUrls: ['./member-summary-card.component.scss'],
})
export class MemberSummaryCardComponent implements OnInit {
  img!: string;
  positionMapper = POSITION_MAPPER;

  @Input() memberDescription!: MemberDescriptionType;
  @Input() alingment: 'horizontal' | 'vertical' = 'vertical';
  @Input() transparent: boolean = false;
  @Input('show-indicator') showIndicator: boolean = true;
  constructor() {}

  ngOnInit(): void {
    
    this.img = this.memberDescription.user.image || this.memberDescription.member.image || DEFAULT_PROFILE_IMG;
  }
}
