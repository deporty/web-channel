import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PagesModule } from './presentation/pages/pages.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PagesModule,
  ]
})
export class AdministrationModule { }
