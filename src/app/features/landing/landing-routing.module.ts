import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationComponent } from './presentation/pages/quotation/quotation.component';
import { WelcomeComponent } from './presentation/pages/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: {
      display: 'Sobre nosotros',
    },
  },

  {
    path: WelcomeComponent.route,
    component: WelcomeComponent,
    data: {
      display: 'Sobre nosotros',
    },
  },

  {
    path: QuotationComponent.route,
    component: QuotationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {
  static route = 'landing';
  static display = 'Inicio';
}
