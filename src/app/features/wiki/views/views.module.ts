import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentStatusWikiComponent } from './tournament-status-wiki/tournament-status-wiki.component';
import { IndexWikiComponent } from './index-wiki/index-wiki.component';

import {MatTreeModule} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { HowToRegisterATeamIntoTournamentComponent } from './how-to-register-a-team-into-tournament/how-to-register-a-team-into-tournament.component';


@NgModule({
  declarations: [
    TournamentStatusWikiComponent,
    IndexWikiComponent,
    HowToRegisterATeamIntoTournamentComponent
  ],
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ]
})
export class ViewsModule { }
