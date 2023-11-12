import { Coordinate, LocationEntity } from '@deporty-org/entities';
import { Id } from '@deporty-org/entities/general';
import { IPlayerModel } from '@deporty-org/entities/players';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FinancialStatusType,
  IntergroupMatchEntity,
  MatchEntity,
  RegisteredTeamEntity,
  TournamentEntity,
  TournamentStatusType,
} from '@deporty-org/entities/tournaments';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { RegisteredTeamStatus } from '@deporty-org/entities/tournaments/registered-teams.entity';
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

export const GetTournamentByIdCommand = createAction(
  '[TournamentDetailComponent] GetTournamentByIdCommand',
  props<{ tournamentId: string }>()
);
export const GetGroupedMatchesByTournamentByIdCommand = createAction(
  '[TournamentDetailComponent] GetGroupedMatchesByTournamentByIdCommand',
  props<{ tournamentId: Id }>()
);

export const GetCurrentTournamentsCommand = createAction(
  '[] GetCurrentTournamentsCommand'
);

export const GetAllTournamentsCommand = createAction(
  'GetAllTournamentsCommand'
);

export const CalculateTournamentCostCommand = createAction(
  'CalculateTournamentCostCommand',
  props<{ tournamentId: Id }>()
);

export const TournamentCostGottenEvent = createAction(
  'TournamentCostGottenEvent',
  props<{ data: any; tournamentId: Id }>()
);

export const GetTournamentByPositionCommand = createAction(
  '[XX] GetTournamentByPositionCommand',
  props<{ ratio: number; position: Coordinate }>()
);
export const ModifyTournamentStatusCommand = createAction(
  '[TournamentDetailComponent] ModifyTournamentStatusCommand',
  props<{
    tournamentId: Id;
    status: TournamentStatusType;
    transactionId: string;
  }>()
);
export const ModifyTournamentFinancialStatusCommand = createAction(
  'ModifyTournamentFinancialStatusCommand',
  props<{
    tournamentId: Id;
    financialStatus: FinancialStatusType;
    transactionId: string;
  }>()
);
export const ModifyTournamentLocationsCommand = createAction(
  '[XX] ModifyTournamentLocationsCommand',
  props<{
    tournamentId: Id;
    locations: Id[];
    transactionId: string;
  }>()
);
export const ModifyTournamentRefereesCommand = createAction(
  '[XX] ModifyTournamentRefereesCommand',
  props<{
    tournamentId: Id;
    refereeIds: Id[];
    transactionId: string;
  }>()
);
export const GetLessDefeatedFenceByTournametIdCommand = createAction(
  '[XX] GetLessDefeatedFenceByTournametIdCommand',
  props<{
    tournamentId: Id;
  }>()
);

export const GenerateMainDrawCommand = createAction(
  '[XX] GenerateMainDrawCommand',
  props<{
    tournamentId: Id;
    transactionId: string;
  }>()
);
// TODO
export const GetUserInRegisteredMemberCommand = createAction(
  '[XX] GetUserInRegisteredMemberCommand',
  props<{
    teamId: Id;
  }>()
);

export const GetRegisteredUsersByMemberAndTeamIdsCommand = createAction(
  '[TeamComponent] GetRegisteredUsersByMemberAndTeamIdsCommand',
  props<{
    filters: {
      teamId: Id;
      memberId: Id;
    }[];
  }>()
);
export const GetRegisteredUsersByMemberInsideTeamIdCommand = createAction(
  '[TeamComponent] GetRegisteredUsersByMemberInsideTeamIdCommand',
  props<{
    teamId: Id;
  }>()
);

export const ModifyRegisteredTeamStatusCommand = createAction(
  '[TournamentDetailComponent] ModifyRegisteredTeamStatusCommand',
  props<{
    tournamentId: Id;
    registeredTeamId: Id;
    status: RegisteredTeamStatus;
    transactionId: string;
  }>()
);

export const GetMarkersTableCommand = createAction(
  '[MarkersTableComponent] GetMarkersTableCommand',
  props<{ tournamentId: string }>()
);

export const GetRegisteredTeamsCommand = createAction(
  '[RegisteredTeamsComponent] GetRegisteredTeamsCommand',
  props<{ tournamentId: string }>()
);
export const DeleteRegisteredTeamsCommand = createAction(
  '[RegisteredTeamsComponent] DeleteRegisteredTeamsCommand',

  props<{ tournamentId: Id; registeredTeamId: Id; transactionId: string }>()
);

export const ClearRegisteredTeamsCommand = createAction(
  '[RegisteredTeamsComponent] ClearRegisteredTeamsCommand'
);
export const GetAvailableTeamsToAddCommand = createAction(
  '[TournamentDetailComponent] GetAvailableTeamsToAddCommand',
  props<{
    tournamentId: string;
    member?: string;
    name?: string;
    category?: string;
  }>()
);

export const RegisterTeamsCommand = createAction(
  '[TournamentDetailComponent] RegisterTeamsCommand',
  props<{ tournamentId: string; teams: TeamEntity[]; transactionId: string }>()
);

export const ResetStatusCommand = createAction(
  '[TournamentDetailComponent] ResetStatusCommand'
);

export const GetIntergroupMatchCommand = createAction(
  '[EditIntergroupMatchComponent] GetIntergroupMatchCommand',
  props<{
    tournamentId: string;
    stageId: string;
    intergroupMatchId: string;
  }>()
);

export const GetMatchHistoryCommand = createAction(
  '[MatchHistoryComponent] GetMatchHistoryCommand',
  props<{ tournamentId: string; stageId: string; stageOrder: number }>()
);

export const GetAllPlayersCommand = createAction(
  '[AddPlayerDirectlyComponent] GetAllPlayersCommand'
);

export const GetMatchByTeamsInStageGroupCommand = createAction(
  '[EditMatchComponent] GetMatchByTeamsInStageGroupCommand',
  props<{
    tournamentId: string;
    stageId: string;
    groupLabel: string;
    teamAId: string;
    teamBId: string;
  }>()
);

export const GetNodeMatchCommand = createAction(
  '[EditNodeMatchComponent] GetNodeMatchCommand',
  props<{
    tournamentId: string;
    nodeMatchId: string;
  }>()
);

export const GetTournamentsByOrganizationAndTournamentLayoutCommand =
  createAction(
    '[TournamentListComponent] GetTournamentsByOrganizationAndTournamentLayoutCommand',
    props<{
      organizationId: Id;
      tournamentLayoutId: Id;
      includeDraft: boolean;
    }>()
  );

export const ConsultedTournamentEvent = createAction(
  '[TournamentsEffects] ConsultedTournamentEvent',
  props<{ tournament: TournamentEntity }>()
);

export const UpdatedTournamentsOverviewEvent = createAction(
  '[TournamentsEffects] UpdatedTournamentsOverviewEvent',
  props<{ tournaments: Array<TournamentEntity> }>()
);
export const ConsultedGroupedMatchesByTournamentEvent = createAction(
  '[TournamentsEffects] ConsultedGroupedMatchesByTournamentEvent',
  props<{ matches: any; tournamentId: Id }>()
);
export const ConsultedLessDefeatedFenceEvent = createAction(
  '[TournamentsEffects] ConsultedLessDefeatedFenceEvent',
  props<{ report: any; tournamentId: Id }>()
);

export const ConsultedMarkersTableEvent = createAction(
  '[TournamentsEffects] ConsultedMarkersTableEvent',
  props<{ table: any[] }>()
);

export const ConsultedRegisteredTeamsEvent = createAction(
  '[TournamentsEffects] ConsultedRegisteredTeamsEvent',
  props<{
    registeredTeams: RegisteredTeamEntity[];
  }>()
);

export const UpdateAvailableTeamsToAddEvent = createAction(
  '[TournamentsEffects] UpdateAvailableTeamsToAdd',
  props<{ teams: TeamEntity[] }>()
);

export const UpdateNewRegisteredTeamsEvent = createAction(
  '[TournamentsEffects] UpdateNewRegisteredTeamsEvent',
  props<{
    registeredTeams: RegisteredTeamEntity[];
  }>()
);
export const ModifiedTournamentStatusEvent = createAction(
  '[TournamentsEffects] ModifiedTournamentStatusEvent',
  props<{
    tournament: TournamentEntity;
  }>()
);
export const ModifiedTournamentFinancialStatusEvent = createAction(
  '[TournamentsEffects] ModifiedTournamentFinancialStatusEvent',
  props<{
    tournament: TournamentEntity;
  }>()
);
export const ModifiedTournamentLocationsEvent = createAction(
  '[TournamentsEffects] ModifiedTournamentLocationsEvent',
  props<{
    tournament: TournamentEntity;
  }>()
);
export const ModifiedTournamentRefereesEvent = createAction(
  '[TournamentsEffects] ModifiedTournamentRefereesEvent',
  props<{
    tournament: TournamentEntity;
  }>()
);
export const ModifiedRegisteredTeamStatusEvent = createAction(
  '[TournamentsEffects] ModifiedRegisteredTeamStatusEvent',
  props<{
    tournamentId: Id;
    registeredTeam: RegisteredTeamEntity;
  }>()
);
export const DeletedRegisteredTeamEvent = createAction(
  '[TournamentsEffects] DeletedRegisteredTeamEvent',
  props<{
    tournamentId: Id;
    registeredTeamId: Id;
  }>()
);

export const UpdateMatchHistoryEvent = createAction(
  '[TournamentsEffects] UpdateMatchHistory',
  props<{
    response: any;
    stageId: string;
    stageOrder: number;
  }>()
);

export const UpdateAllPlayersEvent = createAction(
  '[TournamentsEffects] UpdateAllPlayers',
  props<{
    players: IPlayerModel[];
  }>()
);

export const ConsultedMainDrawByTournamentEvent = createAction(
  '[TournamentsEffects] ConsultedMainDrawByTournamentEvent',
  props<{
    nodeMatches: NodeMatchEntity[];
  }>()
);

export const UpdateCurrentMatchByTeamsInStageGroupEvent = createAction(
  '[TournamentsEffects] UpdateCurrentMatchByTeamsInStageGroup',
  props<{
    match: MatchEntity;
  }>()
);

export const UpdateCurrentNodeMatchEvent = createAction(
  '[TournamentsEffects] UpdateCurrentNodeMatch',
  props<{
    nodeMatch: NodeMatchEntity;
  }>()
);

export const UpdateIntergroupMatchesEvent = createAction(
  '[TournamentsEffects] UpdateIntergroupMatches',
  props<{
    intergroupMatches: IntergroupMatchEntity[];
    stageId: string;
  }>()
);
export const UpdateIntergroupMatchEvent = createAction(
  '[TournamentsEffects] UpdateIntergroupMatch',
  props<{
    intergroupMatch: IntergroupMatchEntity;
  }>()
);

export const UpdatedCurrentIntergroupMatchEvent = createAction(
  '[TournamentsEffects] UpdatedCurrentIntergroupMatch',
  props<{
    tournamentId: string;
    stageId: string;
    intergroupMatch: IntergroupMatchEntity;
  }>()
);

export const IntergroupMatchAddedEvent = createAction(
  '[TournamentsEffects] IntergroupMatchAdded',
  props<{
    tournamentId: string;
    stageId: string;
    intergroupMatch: IntergroupMatchEntity;
  }>()
);
