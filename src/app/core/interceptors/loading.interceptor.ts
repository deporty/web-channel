import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities';
import { getAuth, signOut } from 'firebase/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { userTokenKey } from 'src/app/app.constants';
import { AuthRoutingModule } from 'src/app/features/auth/auth-routing.module';
import { USER_INFORMATION, app } from 'src/app/init-app';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  loadingDialog!: MatDialogRef<any> | null;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}

  closeSession() {
    const auth = getAuth(app);

    signOut(auth).then(() => {
      localStorage.removeItem(userTokenKey);
      USER_INFORMATION['user'] = undefined;
      USER_INFORMATION['token'] = undefined;
      this.router.navigate([AuthRoutingModule.route]);
    });
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headers: any = {
      Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
    };

    const token = USER_INFORMATION['token'];
    if (token) {
      headers['User-Token'] = token;
    }
    const request = req.clone({
      setHeaders: headers,
    });
    const subcription = next.handle(request);


    return subcription.pipe(
      tap((res) => {
        if (res.type == 4) {
          const data = res.body as IBaseResponse<any>;
          if (data.meta?.code == 'AUTHORIZATION:ERROR') {
            this.closeSession();
          }
        }
      })
    );
  }

  isAServerRequest(url: string) {
    return url.indexOf(environment.serverEndpoint) != -1;
  }
}
