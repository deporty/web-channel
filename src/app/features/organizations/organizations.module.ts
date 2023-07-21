import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { PagesModule } from './pages/pages.module';
import { OrganizationAdapter } from './service/organization.adapter';
import { OrganizationService } from './service/organization.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesModule,
    OrganizationsRoutingModule,
  ],
  providers: [
    {
      provide: OrganizationAdapter,
      useClass: OrganizationService,
    },
  ],
})
export class OrganizationsModule {}
