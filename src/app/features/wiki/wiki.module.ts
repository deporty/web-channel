import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WikiRoutingModule } from './wiki-routing.module';
import { ViewsModule } from './views/views.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WikiRoutingModule,
    ViewsModule
  ]
})
export class WikiModule { }
