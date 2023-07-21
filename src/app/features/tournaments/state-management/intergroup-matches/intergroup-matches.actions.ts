import { Id } from '@deporty-org/entities/general';
import { IMatchStatusType, IntergroupMatchEntity } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const TransactionResolvedEvent = createAction(
  '[IntergroupMatchesEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);

export const TransactionDeletedEvent = createAction(
  '[IntergroupMatchesEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const GetIntergroupMatchesCommand = createAction(
  '[XX] GetIntergroupMatchesCommand',
  props<{ tournamentId: Id; fixtureStageId: Id;
  
  states: IMatchStatusType[]
  }>()
);
export const DeleteIntergroupMatchCommand = createAction(
  '[] DeleteIntergroupMatchCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    intergroupMatchId: Id;
    transactionId: string;
  }>()
);

export const CreateIntergroupMatchCommand = createAction(
  '[GeneralTournamentDetailComponent] CreateIntergroupMatchCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    transactionId: string;
    teamAId: Id;
    teamBId: Id;
  }>()
);

export const ConsultedIntergroupMatchesEvent = createAction(
  '[IntergroupMatchesEffects] ConsultedIntergroupMatchesEvent',
  props<{
    intergroupMatches: Array<IntergroupMatchEntity>;
    fixtureStageId: Id;
    tournamentId: Id;
  }>()
);

export const DeletedIntergroupMatchEvent = createAction(
  '[IntergroupMatchesEffects] DeletedIntergroupMatchEvent',
  props<{ fixtureStageId: Id; tournamentId: Id; intergroupMatchId: Id }>()
);




export const EditIntergroupMatchCommand = createAction(
  '[XX] EditIntergroupMatchCommand',
  props<{
    transactionId: string;
    tournamentId: Id;
    fixtureStageId: Id;
    intergroupMatch: IntergroupMatchEntity;
  }>()
);