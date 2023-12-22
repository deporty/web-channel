import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PagesModule } from './presentation/pages/pages.module';
import {
  ResourceService,
  ResourcesContract,
} from './infrastructure/resources.contract';
import { HttpClientModule } from '@angular/common/http';
import { RolesService, RolesContract } from './infrastructure/roles.contract';
import {
  PermissionsContract,
  PermissionsService,
} from './infrastructure/permissions.contract';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PagesModule,

    HttpClientModule,
  ],
  providers: [
    {
      provide: RolesContract,
      useClass: RolesService,
    },
    {
      provide: PermissionsContract,
      useClass: PermissionsService,
    },
    {
      provide: ResourcesContract,
      useClass: ResourceService,
    },
  ],
})
export class AdministrationModule {}
