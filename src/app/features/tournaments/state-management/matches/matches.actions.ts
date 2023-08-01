import { Id } from '@deporty-org/entities/general';
import { MatchEntity, MatchStatusType } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const TransactionResolvedEvent = createAction(
  '[TournamentsEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);
export const TransactionDeletedEvent = createAction(
  '[TournamentsEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const GetMatchCommand = createAction(
  '[GeneralTournamentDetailComponent] GetMatchCommand',
  props<{ tournamentId: Id; stageId: Id; groupId: Id; matchId: Id }>()
);

export const GetMatchsByGroupIdCommand = createAction(
  '[TournamentDetailComponent] GetMatchsByGroupIdCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    states: MatchStatusType[]
  }>()
);
export const DeleteMatchesByGroupIdCommand = createAction(
  '[TournamentDetailComponent] DeleteMatchesByGroupIdCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
  }>()
);

export const CreateMatchCommand = createAction(
  '[TournamentDetailComponent] CreateMatchCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    date: Date;
    teamAId: Id;
    teamBId: Id;
  }>()
);

export const AddMatchToGroupCommand = createAction(
  '[TournamentDetailComponent] AddMatchToGroupCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    teamAId: Id;
    teamBId: Id;
    transactionId: string;
  }>()
);

export const UpdatedMatchEvent = createAction(
  '[TournamentsEffects] UpdatedMatchEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    match: MatchEntity;
  }>()
);
export const EditGroupMatchCommand = createAction(
  '[XXX] EditGroupMatchCommand',
  props<{
    transactionId: string;

    match: MatchEntity;
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
  }>()
);

export const CreatedMatchEvent = createAction(
  '[TournamentsEffects] CreatedMatchEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    match: MatchEntity;
  }>()
);
export const ConsultedMatchsEvent = createAction(
  '[TournamentsEffects] ConsultedMatchsEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    matches: MatchEntity[];
  }>()
);
