import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentTournamentListComponent } from './presentation/pages/current-tournament-list/current-tournament-list.component';
import { EditMatchInGroupComponent } from './presentation/pages/edit-match-group/edit-match-group.component';
import { EditNodeMatchComponent } from './presentation/pages/edit-node-match/edit-node-match.component';
import { CurrentTournamentComponent } from './presentation/pages/index-tournament/index-tournament.component';
import { OrganizationListComponent } from './presentation/pages/organization-list/organization-list.component';
import { TournamentDetailComponent } from './presentation/pages/tournament-detail/tournament-detail.component';
import { TournamentListComponent } from './presentation/pages/tournament-list/tournament-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TournamentListByPositionComponent,
  //   data: {
  //     display: 'Torneos',
  //   },
  // },
  {
    path: '',
    component: CurrentTournamentListComponent,
    data: {
      display: 'Torneos en curso',
    },
  },
  {
    path: OrganizationListComponent.route,
    component: OrganizationListComponent,
    data: {
      display: 'Organizaciones',
    },
  },


  // {
  //   path: TournamentLayoutListComponent.route,
  //   component: TournamentLayoutListComponent,
  //   data: {
  //     display: 'Torneos por Organización',
  //   },
  // },
  {
    path: TournamentListComponent.route,
    component: TournamentListComponent,
    data: {
      display: 'Torneos por Organización',
    },
  },



  {
    path:`${TournamentDetailComponent.route}`,
    component: TournamentDetailComponent,
    data: {
      display: 'Detalle',
    },
  },


  {
    path: CurrentTournamentComponent.route,
    component: CurrentTournamentComponent,
    data: {
      display: 'TournamentsRoutingModule.display',
    },
  },
  {
    path: `${TournamentDetailComponent.route}/${EditMatchInGroupComponent.route}`,
    component: EditMatchInGroupComponent,
  },

  {
    path: `${TournamentDetailComponent.route}/${EditNodeMatchComponent.route}`,
    component: EditNodeMatchComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentsRoutingModule {
  static route = 'tournaments';
  static display = 'Torneos';
}
