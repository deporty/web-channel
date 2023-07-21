import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './presentation/pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      display: 'Inicio de Sesión',
    },
  },
  {
    path: LoginComponent.route,
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
  static route = 'auth';
}
