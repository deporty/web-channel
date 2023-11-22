import { Component, Input, OnInit } from '@angular/core';
import { IPlayerModel } from '@deporty-org/entities/players';
import {
  MemberDescriptionType,
  MemberEntity,
} from '@deporty-org/entities/teams';
import { DEFAULT_PROFILE_IMG } from 'src/app/app.constants';
import { POSITION_MAPPER } from '../../../constants';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';

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
  constructor(private externalResourcePipe: ExternalResourcePipe) {}

  ngOnInit(): void {
    this.img =
      this.externalResourcePipe.transform(
        this.memberDescription.member.image || this.memberDescription.user.image
      ) || DEFAULT_PROFILE_IMG;
  }

  getIndicator(memberDescription: MemberDescriptionType) {
    const kindMember = Array.isArray(memberDescription.member.kindMember)
      ? memberDescription.member.kindMember
      : [memberDescription.member.kindMember];

    if (kindMember.includes('player')) {
      return memberDescription.member.number;
    } else if (kindMember.includes('technical-director')) {
      return 'DT';
    } else if (kindMember.includes('owner')) {
      return 'Pr';
    }
  }
}
