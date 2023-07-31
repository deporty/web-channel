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
import { URL_EXCEPTIONS } from './exceptions';
import { USER_INFORMATION, app } from 'src/app/init-app';
import { getAuth, signOut } from 'firebase/auth';
import { userTokenKey } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { AuthRoutingModule } from 'src/app/features/auth/auth-routing.module';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  isShowed = false;

  loadingDialog!: MatDialogRef<any> | null;

  counter: number;
  constructor(
    public dialog: MatDialog,

    private router: Router
  ) {
    this.counter = 0;
  }

  isAException(url: string) {
    for (const exception of URL_EXCEPTIONS) {
      const index = url.indexOf(exception);
      if (index >= 0) {
        return true;
      }
    }
    return false;
  }
  isAServerRequest(url: string) {
    return url.indexOf(environment.serverEndpoint) != -1;
  }
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headers: any = {
      Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
    };

    const token = USER_INFORMATION['token'];
    const request = req.clone({
      setHeaders: headers,
    });
    const subcription = next.handle(request);

    console.log('URL', request.url);
    if (!token) {
      if (this.isAServerRequest(request.url) && request.url.indexOf('get-token') === -1) {

        const auth = getAuth(app);

        signOut(auth).then(() => {
          localStorage.removeItem(userTokenKey);

          USER_INFORMATION['user'] = undefined;
          USER_INFORMATION['token'] = undefined;
        });

        this.router.navigate([AuthRoutingModule.route]);
      }

      return subcription;
    }
    headers['User-Token'] = token;

    const isAException = this.isAException(request.url);
    if (!isAException) {
      if (this.counter === 0) {
        // this.openLoadingModal();
      }
      this.counter++;
    }
    return subcription.pipe(
      finalize(() => {
        if (!isAException) {
          this.counter--;
          if (this.counter === 0) {
            this.closeLoadingModal();
          }
        }
      })
    );
  }

  private closeLoadingModal() {
    if (this.loadingDialog) {
      this.loadingDialog.close();
      this.loadingDialog = null;
    }
  }

  private openLoadingModal() {
    this.closeLoadingModal();
    this.loadingDialog = this.dialog.open(ModalComponent, {
      disableClose: true,
      backdropClass: 'my-backdrop',
      data: {
        kind: 'loading',
      },
    });
  }
}
