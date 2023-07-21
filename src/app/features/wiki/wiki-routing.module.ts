import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentStatusWikiComponent } from './views/tournament-status-wiki/tournament-status-wiki.component';
import { IndexWikiComponent } from './views/index-wiki/index-wiki.component';
import { MODULE_PATH } from './wiki.constants';
import { HowToRegisterATeamIntoTournamentComponent } from './views/how-to-register-a-team-into-tournament/how-to-register-a-team-into-tournament.component';

const routes: Routes = [
  {
    path: '',
    component: IndexWikiComponent,
  },
  {
    path: TournamentStatusWikiComponent.route,
    component: TournamentStatusWikiComponent,
  },
  {
    path: HowToRegisterATeamIntoTournamentComponent.route,
    component: HowToRegisterATeamIntoTournamentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WikiRoutingModule {
  static route = MODULE_PATH;
}
