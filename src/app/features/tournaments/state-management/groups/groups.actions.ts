import { Id } from '@deporty-org/entities/general';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  GroupEntity,
  PointsStadistics,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

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

export const TransactionDeletedEvent = createAction(
  '[GroupsEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const GetGroupDefinitionCommand = createAction(
  '[GeneralTournamentDetailComponent] GetGroupDefinition',
  props<{ tournamentId: string; stageId: string; groupLabel: string }>()
);

export const GetGroupsByFixtureStageCommand = createAction(
  '[TournamentDetailComponent] GetGroupsByFixtureStageCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
  }>()
);

export const CreateGroupCommand = createAction(
  '[TournamentDetailComponent] CreateGroupCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupLabel: string;
    groupOrder: number;
    transactionId: Id;
  }>()
);

export const DeleteGroupCommand = createAction(
  '[] DeleteGroupCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    transactionId: string;
  }>()
);
export const DeleteGroupsByFixtureIdCommand = createAction(
  '[] DeleteGroupsByFixtureIdCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
  }>()
);
export const DeleteTeamsInGroupCommand = createAction(
  '[] DeleteTeamsInGroupCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    transactionId: string;
    teamIds: Id[];
  }>()
);

export const GetPositionTablesCommand = createAction(
  '[TournamentDetailComponent] GetPositionTablesCommand',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
  }>()
);

export const UpdateGroupSpecificationEvent = createAction(
  '[TournamentsEffects] UpdateGroupSpecificationEvent',
  props<{ group: GroupEntity; tournamentId: Id }>()
);

export const CreateGroupEvent = createAction(
  '[TournamentsEffects] CreateGroupEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    group: GroupEntity;
  }>()
);
export const DeletedGroupEvent = createAction(
  '[TournamentsEffects] DeletedGroupEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
  }>()
);
export const DeletedTeamsInGroupEvent = createAction(
  '[TournamentsEffects] DeletedTeamsInGroupEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    group: GroupEntity;
  }>()
);
export const ConsultedGroupsEvent = createAction(
  '[TournamentsEffects] ConsultedGroupsEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groups: GroupEntity[];
  }>()
);

export const AddTeamToGroupCommand = createAction(
  '[TournamentDetailComponent] AddTeamToGroup',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    teams: Id[];
    transactionId: string;
  }>()
);

export const UpdatePositionTablesEvent = createAction(
  '[GroupsEffects] UpdatePositionTables',
  props<{
    table: PositionsTable;
    groupId: Id;
  }>()
);
