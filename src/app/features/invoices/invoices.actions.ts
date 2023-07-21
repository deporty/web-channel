import { createAction, props } from '@ngrx/store';

export const ConsultInvoicesTournament = createAction(
  '[IndexComponent] ConsultInvoicesTournament',
  props<{ organizationId: string }>()
);
export const UpdateInvoicesTournaments = createAction(
  '[InvoicesEffects] UpdateInvoicesTournaments',
  props<{ payload: any[] }>()
);
export const reset = createAction('[Index Component] Reset');
