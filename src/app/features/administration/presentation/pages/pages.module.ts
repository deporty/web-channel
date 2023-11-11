import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsFinancialStatementsComponent } from './tournaments-financial-statements/tournaments-financial-statements.component';
import { ComponentsModule as TournamentComponentsModule } from "../../../tournaments/presentation/components/components.module";
import { CoreModule } from "../../../../core/core.module";
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    TournamentsFinancialStatementsComponent
  ],
  imports: [
    CommonModule,
    TournamentComponentsModule,
    CoreModule,
    MatButtonModule
  ]
})
export class PagesModule { }
