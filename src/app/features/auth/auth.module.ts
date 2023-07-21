import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationRepository } from './domain/repository/authentication.repository';
import { IsUserLoggedInUsecase } from './domain/usecases/is-user-logged-in/is-user-logged-in.usecase';
import { LoginUserUsecase } from './domain/usecases/login-user/login-user.usecase';
import { AuthenticationService } from './infrastructure/services/authentication/authentication.service';
import { AuthorizationService } from './infrastructure/services/authorization/authorization.service';
import { PagesModule } from './presentation/pages/pages.module';

@NgModule({
  declarations: [],
  imports: [CoreModule, CommonModule, AuthRoutingModule, PagesModule],
  providers: [
    LoginUserUsecase,
    IsUserLoggedInUsecase,
    { provide: AuthenticationRepository, useClass: AuthenticationService },
    AuthorizationService,
  ],
  exports: [RouterModule],
})
export class AuthModule {}
