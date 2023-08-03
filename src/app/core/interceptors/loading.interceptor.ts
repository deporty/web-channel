import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../presentation/components/modal/modal.component';
import { finalize, map, tap } from 'rxjs/operators';
import { USER_INFORMATION, app } from 'src/app/init-app';
import { getAuth, signOut } from 'firebase/auth';
import { userTokenKey } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { AuthRoutingModule } from 'src/app/features/auth/auth-routing.module';
import { environment } from 'src/environments/environment';
import { IBaseResponse } from '@deporty-org/entities';

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

    if (!token) {
      if (
        this.isAServerRequest(request.url) &&
        request.url.indexOf('get-token') === -1
      ) {
        this.closeSession();
      }

      return subcription;
    }

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
