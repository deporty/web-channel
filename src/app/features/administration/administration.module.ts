import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PagesModule } from './presentation/pages/pages.module';
import {
  ResourceService,
  ResourcesContract,
} from './infrastructure/resources.contract';
import { HttpClientModule } from '@angular/common/http';

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
      provide: ResourcesContract,
      useClass: ResourceService,
    },
  ],
})
export class AdministrationModule {}
