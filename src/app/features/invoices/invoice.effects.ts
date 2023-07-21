import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {
  ConsultInvoicesTournament,
  UpdateInvoicesTournaments,
} from './invoices.actions';
import { InvoicesService } from './invoices/invoices.service';

@Injectable()
export class InvoicesEffects {
  constructor(
    private actions$: Actions,
    private moviesService: InvoicesService
  ) {}

  loadMovies$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultInvoicesTournament.type),
      mergeMap(() =>
        this.moviesService.getInvoicesTournaments('zKrqCNZLT6XF5rVEDIxU').pipe(
          map((movies) => UpdateInvoicesTournaments({
              payload: movies.data
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
