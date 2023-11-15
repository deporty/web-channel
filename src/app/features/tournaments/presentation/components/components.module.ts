import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule as PlayerComponentsModule } from '../../../users/components/components.module';
import { AddPlayerDirectlyComponent } from './add-player-directly/add-player-directly.component';
import { AddTeamCardComponent } from './add-team-card/add-team-card.component';
import { CardFormComponent } from './card-form/card-form.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddMatchCardComponent } from './add-match-card/add-match-card.component';
import { EditMatchComponent } from './edit-match/edit-match.component';
import { GoalFormComponent } from './goal-form/goal-form.component';
import { GroupCardComponent } from './group-card/group-card.component';
import { MainDrawTreeComponent } from './main-draw-tree/main-draw-tree.component';
import { MainDrawComponent } from './main-draw/main-draw.component';
import { MatchCardComponent } from './match-card/match-card.component';
import { MatchSummaryCardComponent } from './match-summary-card/match-summary-card.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { PositionTableCardComponent } from './position-table-card/position-table-card.component';
import { TeamSummaryCardComponent } from './team-summary-card/team-summary-card.component';
import { TournamentCardComponent } from './tournament-card/tournament-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FixtureStageComponent } from './fixture-stage/fixture-stage.component';
import { TournamentLayoutCardComponent } from './tournament-layout-card/tournament-layout-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AddTeamToGroupCardComponent } from './add-team-to-group-card/add-team-to-group-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatchVisualizationComponent } from './match-visualization/match-visualization.component';
import { PlayerFormVisualizationComponent } from './player-form-visualization/player-form-visualization.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { TournamentCardDetailsComponent } from './tournament-card/tournament-card-details/tournament-card-details.component';

const COMPONENTS = [
  TournamentCardComponent,
  GroupCardComponent,
  MatchCardComponent,
  MatchSummaryCardComponent,
  TeamSummaryCardComponent,
  PositionTableCardComponent,
  AddTeamCardComponent,
  AddMatchCardComponent,
  CreateGroupComponent,
  PlayerFormComponent,
  CardFormComponent,
  GoalFormComponent,
  AddPlayerDirectlyComponent,
  MainDrawComponent,
  EditMatchComponent,
  MainDrawTreeComponent,
  FixtureStageComponent,
  TournamentLayoutCardComponent,
  AddTeamToGroupCardComponent,
  MatchVisualizationComponent,
  PlayerFormVisualizationComponent
];

@NgModule({
  declarations: [...COMPONENTS, TournamentCardDetailsComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    CoreModule,
    MatExpansionModule,
    PlayerComponentsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
  ],
})
export class ComponentsModule {}
