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
import { USER_INFORMATION } from 'src/app/init-app';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  isShowed = false;

  loadingDialog!: MatDialogRef<any> | null;

  counter: number;
  constructor(public dialog: MatDialog) {
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
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headers: any = {
      Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
    };
    if (USER_INFORMATION['token']) {
      headers['User-Token'] = USER_INFORMATION['token'];
    }
    const request = req.clone({
      setHeaders: headers,
    });

    const subcription = next.handle(request);
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
