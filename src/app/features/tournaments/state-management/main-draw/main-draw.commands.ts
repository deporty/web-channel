import { NodeMatchEntity } from '@deporty-org/entities';
import { Id } from '@deporty-org/entities/general';
import { createAction, props } from '@ngrx/store';

export const GetMainDrawByTournamentCommand = createAction(
  '[X] GetMainDrawByTournamentCommand',
  props<{ tournamentId: string }>()
);
export const DeleteNodeMatchCommand = createAction(
  '[X] DeleteNodeMatchCommand',
  props<{ tournamentId: Id; nodeMatchId: Id; transactionId: string }>()
);

export const CreateNodeMatchCommand = createAction(
  '[X] CreateNodeMatchCommand',
  props<{ transactionId: string; nodeMatch: NodeMatchEntity }>()
);

export const EditNodeMatchCommand = createAction(
  '[XXX] EditNodeMatchCommand',
  props<{
    transactionId: string;
    nodeMatch: NodeMatchEntity;
  }>()
);
