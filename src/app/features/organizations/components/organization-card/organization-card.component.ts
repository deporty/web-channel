import { Component, Input, OnInit } from '@angular/core';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { DEFAULT_ORGANIZATION_IMG } from 'src/app/app.constants';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss'],
})
export class OrganizationCardComponent implements OnInit {
  defaultOrganizationIso = DEFAULT_ORGANIZATION_IMG;

  constructor(private externalResourcePipe: ExternalResourcePipe) {}
  ngOnInit(): void {
    if (this.organization.iso) {
      this.defaultOrganizationIso = this.externalResourcePipe.transform(
        this.organization.iso
      );
    }
  }
  @Input() organization!: OrganizationEntity;
}
