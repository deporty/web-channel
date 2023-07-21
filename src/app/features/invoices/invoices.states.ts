
export interface InvoicesState {
  status: 'loading' | 'updated';
  tournamentInvoices?: any[];
}

export interface UpdatedInvoicesState extends InvoicesState {}
