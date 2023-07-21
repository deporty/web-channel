import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerCardComponent } from './player-card/player-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { PlayersTableComponent } from './players-table/players-table.component';
import { PlayersSummaryListComponent } from './players-summary-list/players-summary-list.component';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePlayerCardComponent } from './create-player-card/create-player-card.component';
import { PlayerSummaryCardComponent } from './player-summary-card/player-summary-card.component';

const COMPONENTS = [
  PlayerCardComponent,
  PlayersSummaryListComponent,
  PlayersTableComponent,
  CreatePlayerCardComponent,
  PlayerSummaryCardComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ComponentsModule {}
