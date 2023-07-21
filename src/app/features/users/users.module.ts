import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from 'src/app/core/core.module';
import { LoadingInterceptor } from 'src/app/core/interceptors/loading.interceptor';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { UsersRoutingModule } from './users-routing.module';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    InfrastructureModule,
    UsersRoutingModule,
    PagesModule,
  ],
  exports: [
    ComponentsModule,
    InfrastructureModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class UsersModule {}
