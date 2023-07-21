import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { AdsModule } from './features/ads/ads.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import {
  initScope,
  RESOURCES_PERMISSIONS,
  RESOURCES_PERMISSIONS_IT,
  USER_INFORMATION,
  USER_INFORMATION_IT,
} from './init-app';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatDividerModule } from '@angular/material/divider';
import { ROOT_REDUCERS } from './app.state';
import { TournamentsEffects } from './features/tournaments/state-management/tournaments/tournaments.effects';
import { FixtureStagesEffects } from './features/tournaments/state-management/fixture-stages/fixture-stages.effects';
import { GroupEffects } from './features/tournaments/state-management/groups/groups.effects';
import { MatchEffects } from './features/tournaments/state-management/matches/matches.effects';
import { TournamentsModule } from './features/tournaments/tournaments.module';
import { TeamsEffects } from './features/teams/state-management/teams.effects';
import { LocationEffects } from './features/tournaments/state-management/locations/locations.effects';
import { UsersModule } from './features/users/users.module';
import { OrganizationsEffects } from './features/organizations/organizations.effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UsersEffects } from './features/users/state-management/users.effects';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MainDrawEffects } from './features/tournaments/state-management/main-draw/main-draw.effects';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IntergroupMatchesEffects } from './features/tournaments/state-management/intergroup-matches/intergroup-matches.effects';
import { UserAdapter } from './features/users/infrastructure/user.adapter';
import { AuthorizationService } from './features/auth/infrastructure/services/authorization/authorization.service';
import { AuthModule } from './features/auth/auth.module';

registerLocaleData(localeEs);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    AdsModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    EffectsModule.forRoot([
      TournamentsEffects,
      FixtureStagesEffects,
      GroupEffects,
      MainDrawEffects,
      MatchEffects,
      TeamsEffects,
      LocationEffects,
      UsersEffects,
      OrganizationsEffects,
      IntergroupMatchesEffects,
    ]),
    InvoicesModule,
    TournamentsModule,
    UsersModule,
    AuthModule,
    MatDialogModule,
    StoreDevtoolsModule.instrument({
      maxAge: 100, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (
        dialog: MatDialog,
        userAdapter: UserAdapter,
        authorizationService: AuthorizationService
      ) => initScope(dialog, userAdapter, authorizationService),
      deps: [MatDialog, UserAdapter, AuthorizationService],
      multi: true,
    },
    {
      provide: RESOURCES_PERMISSIONS_IT,
      useValue: RESOURCES_PERMISSIONS,
    },
    {
      provide: USER_INFORMATION_IT,
      useValue: USER_INFORMATION,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
