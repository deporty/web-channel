import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './core/guards/is-logged-in/is-logged-in.guard';
import { IsNotLoggedInGuard } from './core/guards/is-not-logged-in/is-not-logged-in.guard';
import { LoggedInContainerComponent } from './core/presentation/components/logged-in-container/logged-in-container.component';
import { AuthRoutingModule } from './features/auth/auth-routing.module';
import { AuthModule } from './features/auth/auth.module';
import { HomeRoutingModule } from './features/home/home-routing.module';
import { InvoicesRoutingModule } from './features/invoices/invoices-routing.module';
import { LandingRoutingModule } from './features/landing/landing-routing.module';
import { OrganizationsRoutingModule } from './features/organizations/organizations-routing.module';
import { UsersRoutingModule } from './features/users/users-routing.module';
import { TeamsRoutingModule } from './features/teams/teams-routing.module';
import { TournamentsRoutingModule } from './features/tournaments/tournaments-routing.module';
import { WikiRoutingModule } from './features/wiki/wiki-routing.module';
import { AdministrationRoutingModule } from './features/administration/administration-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: HomeRoutingModule.route,
    pathMatch: 'full',

    data: {
      display: 'Inicio',
    },
  },

  {
    path: AuthRoutingModule.route,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [IsNotLoggedInGuard],
    data: {
      display: 'Autenticación',
    },
  },
  {
    path: WikiRoutingModule.route,
    loadChildren: () =>
      import('./features/wiki/wiki.module').then((m) => m.WikiModule),
      data: {
        display: 'WikiDeporty',
      },
  },
  {
    path: HomeRoutingModule.route,
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },

  {
    path: UsersRoutingModule.route,
    loadChildren: () =>
      import('./features/users/users.module').then((m) => m.UsersModule),
      data: {
        display: 'Jugadores',
      },
  },

  {
    path: InvoicesRoutingModule.route,
    loadChildren: () =>
      import('./features/invoices/invoices.module').then(
        (m) => m.InvoicesModule
      ),
    canLoad: [IsLoggedInGuard],
  },
  {
    path: TeamsRoutingModule.route,
    loadChildren: () =>
      import('./features/teams/teams.module').then((m) => m.TeamsModule),
      data: {
        display: 'Equipos',
      },
    // canLoad: [IsLoggedInGuard],
  },

  {
    path: TournamentsRoutingModule.route,
    loadChildren: () =>
      import('./features/tournaments/tournaments.module').then(
        (m) => m.TournamentsModule
      ),
    data: {
      display: 'Torneos',
    },

    // canLoad: [IsLoggedInGuard],
  },
  {
    path: AdministrationRoutingModule.route,
    loadChildren: () =>
      import('./features/administration/administration.module').then(
        (m) => m.AdministrationModule
      ),
    data: {
      display: 'Administración',
    },

    // canLoad: [IsLoggedInGuard],
  },

  {
    path: LandingRoutingModule.route,
    loadChildren: () =>
      import('./features/landing/landing.module').then((m) => m.LandingModule),
  },

  {
    path: OrganizationsRoutingModule.route,
    canLoad: [IsLoggedInGuard],

    loadChildren: () =>
      import('./features/organizations/organizations.module').then(
        (m) => m.OrganizationsModule
      ),
    data: {
      display: 'Mis Organizaciones',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
