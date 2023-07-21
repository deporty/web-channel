import { Component, Input } from '@angular/core';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { DEFAULT_ORGANIZATION_IMG } from 'src/app/app.constants';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss'],
})
export class OrganizationCardComponent {

  defaultOrganizationIso = DEFAULT_ORGANIZATION_IMG;

  constructor() {}
  @Input() organization!: OrganizationEntity;
}
