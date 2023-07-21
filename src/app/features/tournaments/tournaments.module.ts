import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from 'src/app/core/core.module';
import { LoadingInterceptor } from 'src/app/core/interceptors/loading.interceptor';
import { OrganizationAdapter } from '../organizations/service/organization.adapter';
import { OrganizationService } from '../organizations/service/organization.service';
import { LocationAdapter } from './adapters/location.adapter';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { LocationService } from './infrastructure/location/location.service';
import { PagesModule } from './presentation/pages/pages.module';
import { TournamentsRoutingModule } from './tournaments-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    TournamentsRoutingModule,
    PagesModule,
    InfrastructureModule,
    // StoreModule.forFeature(tournamentsKey, TournamentsReducer),
    // StoreModule.forFeature(fixtureStagesKey, FixtureStagesReducer),
    // StoreModule.forFeature(groupsKey, GroupsReducer),
    // StoreModule.forFeature(matchesKey, MatchesReducer),
    // EffectsModule.forFeature([
    //   TournamentsEffects,
    //   FixtureStagesEffects,
    //   GroupEffects,
    //   MatchEffects
    // ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: OrganizationAdapter,
      useClass: OrganizationService,
    },
    {
      provide: LocationAdapter,
      useClass: LocationService,
    },
  ],
})
export class TournamentsModule {}
