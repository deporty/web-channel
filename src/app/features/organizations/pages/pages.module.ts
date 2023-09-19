import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';
import { MatDividerModule } from '@angular/material/divider';
import { MyOrganizationsComponent } from './my-organizations/my-organizations.component';
import { MatChipsModule } from '@angular/material/chips';
import { ComponentsModule } from '../components/components.module';
import { ComponentsModule as TournamentComponentsModule } from '../../tournaments/presentation/components/components.module';
import { ComponentsModule as TeamsComponentsModule } from '../../teams/presentation/components/components.module';
import { ComponentsModule as TournamentDetailComponentsModule } from '../../tournaments/presentation/pages/tournament-detail/components/components.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreModule } from 'src/app/core/core.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CreateTournamentComponent } from './create-tournament/create-tournament.component';
import { CreateTournamentLayoutComponent } from './create-tournament-layout/create-tournament-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TournamentsByLayoutComponent } from './tournaments-by-layout/tournaments-by-layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { EditTournamentComponent } from './edit-tournament/edit-tournament.component';
import { CreateFixtureStageComponent } from './edit-tournament/components/create-fixture-stage/create-fixture-stage.component';
import { ChangeTournamentStatusComponent } from './edit-tournament/components/change-tournament-status/change-tournament-status.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChangeRegisteredTeamStatusComponent } from './edit-tournament/components/change-registerd-team-status/change-registerd-team-status.component';
import { ViewTournamentStatusComponent } from './edit-tournament/components/view-tournament-status/view-tournament-status.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditTournamentLocationsComponent } from './edit-tournament/components/edit-tournament-locations/edit-tournament-locations.component';
import { MatSliderModule } from '@angular/material/slider';
import { EditTournamentLayoutComponent } from './edit-tournament-layout/edit-tournament-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditRefereesComponent } from './edit-tournament/components/edit-referees/edit-referees.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PreviewTreeComponent } from './edit-tournament-layout/components/preview-tree/preview-tree.component';
import { RequireDocsComponent } from './edit-tournament-layout/components/require-docs/require-docs.component';
import { ViewRequiredDocsComponent } from './edit-tournament/components/view-required-docs/view-required-docs.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    OrganizationDetailComponent,
    MyOrganizationsComponent,
    CreateTournamentComponent,
    CreateTournamentLayoutComponent,
    TournamentsByLayoutComponent,
    EditTournamentComponent,
    CreateFixtureStageComponent,
    ChangeTournamentStatusComponent,
    ChangeRegisteredTeamStatusComponent,
    EditTournamentLocationsComponent,
    ViewTournamentStatusComponent,
    EditTournamentLayoutComponent,
    EditRefereesComponent,
    PreviewTreeComponent,
    RequireDocsComponent,
    ViewRequiredDocsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatExpansionModule,
    NgxExtendedPdfViewerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule,

    MatIconModule,
    TournamentComponentsModule,
    TeamsComponentsModule,
    MatMenuModule,
    CoreModule,
    MatTabsModule,
    TournamentDetailComponentsModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatSliderModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PagesModule {}
