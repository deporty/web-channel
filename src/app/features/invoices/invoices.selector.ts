import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { invoicesKey } from './invoices.reducer';
import { InvoicesState } from './invoices.states';


export const selectInvoicesFeature =
  createFeatureSelector<InvoicesState>(invoicesKey);

export const selectInvoicesCount = createSelector(
  selectInvoicesFeature,
  (state: InvoicesState) => state.tournamentInvoices
);
