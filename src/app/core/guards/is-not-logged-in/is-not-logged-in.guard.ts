import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthRoutingModule } from 'src/app/features/auth/auth-routing.module';
import { HomeRoutingModule } from 'src/app/features/home/home-routing.module';
import { app } from 'src/app/init-app';
import { TokenService } from '../../infrastructure/services/token/token.service';

@Injectable()
export class IsNotLoggedInGuard implements CanLoad {
  constructor(
    private router: Router,
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return new Observable((observer) => {
      const auth = getAuth(app);

      onAuthStateChanged(auth, (user) => {
        const isNotInSession = user == null || user == undefined;
        if (!isNotInSession) {
          this.router.navigate([HomeRoutingModule.route]);
        }
        observer.next(isNotInSession);
        observer.complete();
      });
    });
  }
}
