import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from 'src/app/core/interceptors/loading.interceptor';
import { PagesModule } from './presentation/pages/pages.module';
import { TeamsRoutingModule } from './teams-routing.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { teamsKey, TeamsReducer } from './state-management/teams.reducer';
import { TeamsEffects } from './state-management/teams.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    PagesModule,
    InfrastructureModule,
    StoreModule.forFeature(teamsKey, TeamsReducer),
    EffectsModule.forFeature([TeamsEffects]),

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class TeamsModule { }
