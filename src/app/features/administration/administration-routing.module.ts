import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsFinancialStatementsComponent } from './presentation/pages/tournaments-financial-statements/tournaments-financial-statements.component';
import { IndexComponent } from './presentation/pages/index/index.component';
import { AuthorizationComponent } from './presentation/pages/authorization/authorization.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: TournamentsFinancialStatementsComponent.route,
    component: TournamentsFinancialStatementsComponent
  },
  {
    path: AuthorizationComponent.route,
    component: AuthorizationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {
  static route = 'admin';
}
