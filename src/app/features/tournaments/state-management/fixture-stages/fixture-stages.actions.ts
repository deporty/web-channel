import { Id } from '@deporty-org/entities/general';
import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const TransactionResolvedEvent = createAction(
  '[FixtureStagesEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);

export const TransactionDeletedEvent = createAction(
  '[FixtureStagesEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const GetFixtureStagesCommand = createAction(
  '[GeneralTournamentDetailComponent] GetFixtureStagesCommand',
  props<{ tournamentId: string }>()
);
export const DeleteFixtureStageCommand = createAction(
  '[GeneralTournamentDetailComponent] DeleteFixtureStageCommand',
  props<{ tournamentId: Id; fixtureStageId: Id; transactionId: string }>()
);

export const CreateFixtureStageCommand = createAction(
  '[GeneralTournamentDetailComponent] CreateFixtureStageCommand',
  props<{ transactionId: string; fixtureStage: FixtureStageEntity }>()
);

export const ConsultedFixtureStagesEvent = createAction(
  '[TournamentsEffects] ConsultedFixtureStagesEvent',
  props<{ fixtureStages: Array<FixtureStageEntity>, tournamentId: Id }>()
);


export const GetPositionTablesByFixtureCommand = createAction(
  '[TournamentDetailComponent] GetPositionTablesByFixtureCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
  }>()
);



export const DeletedFixtureStagesEvent = createAction(
  '[TournamentsEffects] DeletedFixtureStagesEvent',
  props<{ fixtureStageId: Id }>()
);
