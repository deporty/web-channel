import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { app } from 'src/app/init-app';
import { AuthenticationRepository } from '../../../domain/repository/authentication.repository';

@Injectable()
export class AuthenticationService extends AuthenticationRepository {
  constructor() {
    super();
  }

  login(email: string, password: string): Observable<string> {
    const auth = getAuth(app);
    
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      catchError((error) => {
        return of(null);
      }),
      map((item: any) => {
        if (item) {

          
          return item.user.accessToken;
        }
        return null;
      })
    );
  }

  public isUserLoggedIn(): Observable<boolean> {
    const auth = getAuth(app);
    const user = auth.currentUser;
    return of(user != null && user != undefined);
  }
}
