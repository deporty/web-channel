import { Id } from '@deporty-org/entities/general';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const TransactionResolvedEvent = createAction(
  '[NodeMatchesEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);

export const TransactionDeletedEvent = createAction(
  '[NodeMatchesEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const ConsultedNodeMatchesEvent = createAction(
  '[NodeMatchesEffects] ConsultedNodeMatchesEvent',
  props<{ nodeMatches: Array<NodeMatchEntity>, tournamentId: Id }>()
);

export const DeletedNodeMatchesEvent = createAction(
  '[NodeMatchesEffects] DeletedNodeMatchesEvent',
  props<{ nodeMatchId: Id }>()
);
