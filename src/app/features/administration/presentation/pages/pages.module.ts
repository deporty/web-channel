import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsFinancialStatementsComponent } from './tournaments-financial-statements/tournaments-financial-statements.component';
import { ComponentsModule as TournamentComponentsModule } from "../../../tournaments/presentation/components/components.module";
import { CoreModule } from "../../../../core/core.module";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TournamentsFinancialStatementsComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    TournamentComponentsModule,
    CoreModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    RouterModule

  ]
})
export class PagesModule { }
