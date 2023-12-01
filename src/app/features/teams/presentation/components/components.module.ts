import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule as PlayersComponentsModule } from '../../../users/components/components.module';
import { CreateAddPlayerComponent } from './create-add-player/create-add-player.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { MemberSummaryCardComponent } from './member-summary-card/member-summary-card.component';
import { TeamCardComponent } from './team-card/team-card.component';
import { TeamSummaryBasicCardComponent } from './team-summary-card/team-summary-card.component';
const COMPONENTS = [
  TeamCardComponent,
  TeamSummaryBasicCardComponent,
  MemberSummaryCardComponent,
  CreateAddPlayerComponent,
  CreatePlayerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    CoreModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PlayersComponentsModule,
    MatDividerModule,
  ],
})
export class ComponentsModule {}
