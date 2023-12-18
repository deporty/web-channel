import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsFinancialStatementsComponent } from './presentation/pages/tournaments-financial-statements/tournaments-financial-statements.component';
import { IndexComponent } from './presentation/pages/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: TournamentsFinancialStatementsComponent.route,
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
