import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreatePlayerComponent } from './pages/create-player/create-player.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { IsLoggedInGuard } from 'src/app/core/guards/is-logged-in/is-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    component: ViewAllComponent,
  },

  {
    path: ViewAllComponent.route,
    component: ViewAllComponent,
  },
  {
    path: CreatePlayerComponent.route,
    component: CreatePlayerComponent,
    canActivate: [IsLoggedInGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
  static route = 'users';
}
