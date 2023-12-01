import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneralTournamentDetailComponent } from './general-tournament-detail/general-tournament-detail.component';
import { MarkersTableComponent } from './markers-table/markers-table.component';
import { LeastBeatenGoalComponent } from './least-beaten-goal/least-beaten-goal.component';
import { CardsGottenComponent } from './cards-gotten/cards-gotten.component';
import { RegisteredTeamsComponent } from './registered-teams/registered-teams.component';
import { StadisticsComponent } from './stadistics/stadistics.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ComponentsModule as TeamsComponentsModule } from '../../../../../teams/presentation/components/components.module';
import { ComponentsModule as GeneralTournamentsComponents } from '../../../components/components.module';

import { CoreModule } from '../../../../../../core/core.module';
import { MatCardModule } from '@angular/material/card';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RegisteredMembersViewComponent } from './registered-teams/components/registered-members-view/registered-members-view.component';
import { MatMenuModule } from '@angular/material/menu';
import { RegisterMemberIntoTournamentComponent } from './registered-teams/components/register-member-into-tournament/register-member-into-tournament.component';

const COMPONENTS = [
  GeneralTournamentDetailComponent,
  MarkersTableComponent,
  LeastBeatenGoalComponent,
  CardsGottenComponent,
  RegisteredTeamsComponent,
  StadisticsComponent,
  MatchHistoryComponent,
];

@NgModule({
  declarations: [...COMPONENTS, RegisteredMembersViewComponent, RegisterMemberIntoTournamentComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    MatTabsModule,
    TeamsComponentsModule,
    GeneralTournamentsComponents,
    MatExpansionModule,
    CoreModule,
    MatCardModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatMenuModule
  ],
  providers: [DatePipe],
})
export class ComponentsModule {}
