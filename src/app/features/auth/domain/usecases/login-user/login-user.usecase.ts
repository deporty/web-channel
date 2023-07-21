import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/core/infrastructure/services/token/token.service';
import { ICredential } from '../../models/credential.model';
import { AuthenticationRepository } from '../../repository/authentication.repository';

export class EmptyCredentialsError extends Error {
  constructor() {
    super();
    this.message = 'One or both credentials are empty or null.';
    this.name = 'Empty Credentials';
  }
}

export class WrongCredentialsError extends Error {
  constructor() {
    super();
    this.message = 'The credentials are invalid.';
    this.name = 'Wrong credentials';
  }
}

@Injectable()
export class LoginUserUsecase {
  constructor(
    private authService: AuthenticationRepository,
    private tokenService: TokenService
  ) {}
  call(credentials: ICredential): Observable<string> {
    return new Observable<any>((observer) => {
      if (!credentials.email || !credentials.password) {
        observer.error(new EmptyCredentialsError());
      }

      this.authService
        .login(credentials.email, credentials.password)
        .subscribe((token) => {
          if (token) {
            this.tokenService.saveToken(token);
            observer.next(token);
            observer.complete();
          } else {
            observer.error(new WrongCredentialsError());
          }
        });
    });
  }
}
