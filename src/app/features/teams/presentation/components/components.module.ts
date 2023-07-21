import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamCardComponent } from './team-card/team-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeamSummaryBasicCardComponent } from './team-summary-card/team-summary-card.component';
import { CoreModule } from 'src/app/core/core.module';
import { MemberSummaryCardComponent } from './member-summary-card/member-summary-card.component';
import { CreateAddPlayerComponent } from './create-add-player/create-add-player.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { ComponentsModule as PlayersComponentsModule } from "../../../users/components/components.module";
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
    PlayersComponentsModule
  ],
})
export class ComponentsModule {}
