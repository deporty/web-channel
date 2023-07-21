import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfrastructureModule as TeamsInfrastructureModule } from '../../teams/infrastructure/infrastructure.module';
import { TournamentAdapter } from '../adapters/tournament.adapter';

import { TournamentService } from './tournament/tournament.service';
import { IntegroupMatchAdapter } from '../adapters/intergroup-match.adapter';
import { IntegroupMatchService } from './intergroup-match/intergroup-match.service';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: TournamentAdapter,
      useClass: TournamentService,
    },
    {
      provide: IntegroupMatchAdapter,
      useClass: IntegroupMatchService,
    },
  ],
  imports: [CommonModule, TeamsInfrastructureModule],
})
export class InfrastructureModule {}
