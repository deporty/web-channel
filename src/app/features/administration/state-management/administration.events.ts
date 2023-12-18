import { Id, ResourceEntity, TournamentEntity } from '@deporty-org/entities';
import { createAction, props } from '@ngrx/store';

export const TransactionDeletedEvent = createAction(
  '[GroupsEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const TransactionResolvedEvent = createAction(
  '[GroupsEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);
export const ConsultedResourcesEvent = createAction(
  'ConsultedResourcesEvent',
  props<{
    resources: ResourceEntity[];
  }>()
);
