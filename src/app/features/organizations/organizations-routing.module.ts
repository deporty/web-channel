import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationDetailComponent } from './pages/organization-detail/organization-detail.component';
import { MyOrganizationsComponent } from './pages/my-organizations/my-organizations.component';
import { CreateTournamentComponent } from './pages/create-tournament/create-tournament.component';
import { CreateTournamentLayoutComponent } from './pages/create-tournament-layout/create-tournament-layout.component';
import { TournamentsByLayoutComponent } from './pages/tournaments-by-layout/tournaments-by-layout.component';
import { EditTournamentComponent } from './pages/edit-tournament/edit-tournament.component';
import { EditTournamentLayoutComponent } from './pages/edit-tournament-layout/edit-tournament-layout.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: MyOrganizationsComponent,
  //   data: {
  //     display: 'Listado',
  //   },
  // },
  {
    path: ``,
    component: OrganizationDetailComponent,
    data: {
      display: 'Detalle',
    },
  },

  {
    path: `:organizationId/${CreateTournamentComponent.route}`,
    component: CreateTournamentComponent,
    data: {
      display: 'Creación de Torneo',
    },
  },
  {
    path: `:organizationId/${CreateTournamentLayoutComponent.route}`,

    component: CreateTournamentLayoutComponent,
    data: {
      display: 'Creación de Plantilla',
    },
  },
  {
    path: `:organizationId/${EditTournamentLayoutComponent.route}/:tournamentLayoutId`,

    component: EditTournamentLayoutComponent,
    data: {
      display: 'Edición de Plantilla',
    },
  },
  {
    path: `:organizationId/${TournamentsByLayoutComponent.route}/:tournamentLayoutId`,

    component: TournamentsByLayoutComponent,
    data: {
      display: 'Torneos por plantilla',
    },
  },
  {
    path: `:organizationId/${TournamentsByLayoutComponent.route}/:tournamentLayoutId/${EditTournamentComponent.route}/:tournamentId`,

    component: EditTournamentComponent,
    data: {
      display: 'Editar Torneo',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsRoutingModule {
  static route = 'my-organizations';
}
