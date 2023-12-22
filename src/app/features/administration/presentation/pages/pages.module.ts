import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsFinancialStatementsComponent } from './tournaments-financial-statements/tournaments-financial-statements.component';
import { ComponentsModule as TournamentComponentsModule } from '../../../tournaments/presentation/components/components.module';
import { CoreModule } from '../../../../core/core.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ResourcesComponent } from './authorization/components/resources/resources.component';
import { CoreModule as GeneralCoreModule } from '../../../../core/core.module';
import { PermissionsComponent } from './authorization/components/permissions/permissions.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    TournamentsFinancialStatementsComponent,
    IndexComponent,
    AuthorizationComponent,
    ResourcesComponent,
    PermissionsComponent,
  ],
  imports: [
    CommonModule,
    TournamentComponentsModule,
    CoreModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    GeneralCoreModule,
    MatDividerModule,
    MatCardModule
  ],
})
export class PagesModule {}
