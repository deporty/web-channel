import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule as TeamsComponentsModule } from '../../../teams/presentation/components/components.module';
import { ComponentsModule } from '../components/components.module';
import { EditIntergroupMatchComponent } from './edit-intergroup-match/edit-intergroup-match.component';
import { EditMatchInGroupComponent } from './edit-match-group/edit-match-group.component';
import { EditNodeMatchComponent } from './edit-node-match/edit-match.component';
import { CurrentTournamentComponent } from './index-tournament/index-tournament.component';
import { ComponentsModule as TournamentDetailComponents } from './tournament-detail/components/components.module';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TournamentLayoutListComponent } from './tournament-layout-list/tournament-layout-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { TournamentListByPositionComponent } from './tournament-list-by-position/tournament-list-by-position.component';
import { CurrentTournamentListComponent } from './current-tournament-list/current-tournament-list.component';
import { NewsModule } from 'src/app/features/news/news.module';
import { MatDialogModule } from '@angular/material/dialog';

const COMPONENTS = [
  TournamentListComponent,
  TournamentDetailComponent,
  CurrentTournamentComponent,
  EditMatchInGroupComponent,
  EditNodeMatchComponent,
  EditIntergroupMatchComponent,
  OrganizationListComponent,
  TournamentLayoutListComponent,
  TournamentListByPositionComponent,
  CurrentTournamentListComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    TeamsComponentsModule,
    TournamentDetailComponents,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    CoreModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatListModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSliderModule,
    NewsModule,
    MatDialogModule
  ],
})
export class PagesModule {}
