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

@NgModule({
  declarations: [
    TournamentsFinancialStatementsComponent,
    IndexComponent,
    AuthorizationComponent,
    ResourcesComponent,
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
    GeneralCoreModule
  ],
})
export class PagesModule {}
