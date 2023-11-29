import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { PagesModule } from './pages/pages.module';
import { OrganizationAdapter } from './service/organization.adapter';
import { OrganizationService } from './service/organization.service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesModule,
    OrganizationsRoutingModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: OrganizationAdapter,
      useClass: OrganizationService,
    },
  ],
})
export class OrganizationsModule {}
