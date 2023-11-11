import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsFinancialStatementsComponent } from './presentation/pages/tournaments-financial-statements/tournaments-financial-statements.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentsFinancialStatementsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {
  static route = 'admin';
}
