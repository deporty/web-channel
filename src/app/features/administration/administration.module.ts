import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { TournamentsFinancialStatementsComponent } from './presentation/pages/tournaments-financial-statements/tournaments-financial-statements.component';
import { PagesModule } from './presentation/pages/pages.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PagesModule
  ]
})
export class AdministrationModule { }
