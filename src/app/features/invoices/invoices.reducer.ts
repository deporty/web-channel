import { createReducer, on } from '@ngrx/store';
import {
  ConsultInvoicesTournament,
  UpdateInvoicesTournaments,
  reset,
} from './invoices.actions';
import { InvoicesState } from './invoices.states';

export const invoicesKey = 'invoices';
export const initialState: InvoicesState = {
  status: 'loading',
};

export const InvoicesReducer = createReducer<InvoicesState, any>(
  initialState,

  on(UpdateInvoicesTournaments, (state, { payload }) => {
    return { ...state, tournamentInvoices: payload };
  }),
  on(reset, (state) => {
    return { ...state, counter: 0 };
  })
);
