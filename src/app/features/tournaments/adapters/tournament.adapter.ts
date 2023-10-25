import { LocationEntity } from '@deporty-org/entities';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FixtureStageEntity,
  GroupEntity,
  MatchStatusType,
  IntergroupMatchEntity,
  MatchEntity,
  NodeMatchEntity,
  PointsStadistics,
  RegisteredTeamEntity,
  TournamentEntity,
  TournamentStatusType,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { RegisteredTeamStatus } from '@deporty-org/entities/tournaments/registered-teams.entity';
import { Observable } from 'rxjs';

export abstract class TournamentAdapter {
  abstract addMatchToGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teamAId: Id,
    teamBId: Id
  ): Observable<IBaseResponse<MatchEntity>>;

  abstract validateSchema(
    schema: TournamentLayoutSchema
  ): Observable<IBaseResponse<boolean>>;
  abstract getCardsReport(tournamentId: string): Observable<
    IBaseResponse<
      {
        teamId: string;
        memberId: string;
        date?: Date;
        cards: {
          yellow: number;
          red: number;
        };
      }[]
    >
  >;

  abstract addTeamsToGroupTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teams: Id[]
  ): Observable<IBaseResponse<GroupEntity>>;
  abstract addTeamsToTournament(
    tournamentId: string,
    teamIds: string[]
  ): Observable<IBaseResponse<RegisteredTeamEntity[]>>;
  abstract createFixtureStage(
    fixtureStage: FixtureStageEntity
  ): Observable<IBaseResponse<FixtureStageEntity>>;
  abstract createGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupLabel: string,
    groupOrder: number
  ): Observable<IBaseResponse<GroupEntity>>;
  abstract createTournament(
    tournament: TournamentEntity
  ): Observable<IBaseResponse<TournamentEntity>>;
  abstract deleteFixtureStage(
    tournamentId: Id,
    fixtureStageId: Id
  ): Observable<IBaseResponse<Id>>;
  abstract deleteGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id
  ): Observable<IBaseResponse<Id>>;
  abstract deleteNodeMatch(
    tournamentId: Id,
    nodeMatchId: Id
  ): Observable<IBaseResponse<Id>>;
  abstract publishAllMatchesInGroupCommand(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id
  ): Observable<IBaseResponse<MatchEntity[]>>;
  abstract deleteRegisteredTeam(
    tournamentId: Id,
    registeredTeamId: Id
  ): Observable<IBaseResponse<Id>>;
  abstract deleteTeamsInGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teamIds: Id[]
  ): Observable<IBaseResponse<GroupEntity>>;
  abstract deleteTournament(
    tournamentId: TournamentEntity
  ): Observable<IBaseResponse<TournamentEntity | null>>;
  abstract downloadMatchSheet(
    tournamentId: string,
    match: MatchEntity
  ): Observable<IBaseResponse<any>>;
  abstract editMatchOfGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    match: MatchEntity
  ): Observable<
    IBaseResponse<{ match: MatchEntity; positionsTable: PositionsTable }>
  >;
  abstract editNodeMatch(
    tournamentId: string,
    match: NodeMatchEntity
  ): Observable<IBaseResponse<NodeMatchEntity>>;
  abstract getAvailableTeamsToAdd(
    tournamentId: string,
    member?: string,
    name?: string,
    category?: string
  ): Observable<IBaseResponse<TeamEntity[]>>;
  abstract getCurrentTournamentsCommand(): Observable<
    IBaseResponse<TournamentEntity[]>
  >;
  abstract getFixtureStagesByTournament(
    id: string
  ): Observable<IBaseResponse<FixtureStageEntity[]>>;
  abstract getGroupSpecificationInsideTournament(
    tournamentId: string,
    stageId: string,
    groupLabel: string
  ): Observable<IBaseResponse<GroupEntity>>;
  abstract getGroupedMatches(
    tournamentId: string,
    stageId: string
  ): Observable<IBaseResponse<any>>;
  abstract getGroupedMatchesByTournamentById(
    tournamentId: Id
  ): Observable<IBaseResponse<any>>;
  abstract getGroupsByFixtureStage(
    tournamentId: string,
    stageId: string
  ): Observable<IBaseResponse<GroupEntity[]>>;
  abstract getGroupsMatchesByTournamentId(
    tournamentId: string,
    stageIndex: number,
    groupIndex: number
  ): Observable<MatchEntity[]>;
  abstract getIntergroupMatch(
    tournamentId: string,
    stageId: string,
    intergroupMatchId: string
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>>;
  abstract getMainDrawByTournament(
    tournamentId: string
  ): Observable<IBaseResponse<NodeMatchEntity[]>>;
  abstract getMarkersTableByTornament(
    id: string
  ): Observable<IBaseResponse<any[]>>;
  abstract getMatchInsideGroup(
    tournamentId: string,
    stageId: string,
    groupLabel: string,
    teamAId: string,
    teamBId: string
  ): Observable<IBaseResponse<MatchEntity | undefined>>;
  abstract getMatchesByGroup(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    states: MatchStatusType[]
  ): Observable<IBaseResponse<MatchEntity[]>>;
  abstract getNodeMatchById(
    tournamentId: string,
    nodeMatchId: string
  ): Observable<IBaseResponse<NodeMatchEntity | undefined>>;
  abstract createNodeMatch(
    nodeMatch: NodeMatchEntity
  ): Observable<IBaseResponse<NodeMatchEntity>>;
  abstract getPositionTables(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id
  ): Observable<IBaseResponse<PointsStadistics[]>>;
  abstract getRegisteredTeams(
    tournamentId: string
  ): Observable<IBaseResponse<RegisteredTeamEntity[]>>;
  abstract getTournamentSummaryById(
    id: string
  ): Observable<IBaseResponse<TournamentEntity>>;
  abstract getTournamentsByOrganizationAndTournamentLayout(
    organizationId: Id,
    tournamentLayoutId: Id,
    includeDraft: boolean
  ): Observable<IBaseResponse<TournamentEntity[]>>;
  abstract modifyRegisteredTeamStatus(
    tournamentId: Id,
    registeredTeamId: Id,
    status: RegisteredTeamStatus
  ): Observable<IBaseResponse<RegisteredTeamEntity>>;
  abstract generateMainDraw(
    tournamentId: Id
  ): Observable<IBaseResponse<NodeMatchEntity[]>>;
  abstract modifyTournamentLocations(
    tournamentId: Id,
    locations: Id[]
  ): Observable<IBaseResponse<TournamentEntity>>;
  abstract modifyTournamentReferees(
    tournamentId: Id,
    refereeIds: Id[]
  ): Observable<IBaseResponse<TournamentEntity>>;
  abstract modifyTournamentStatus(
    tournamentId: string,
    status: TournamentStatusType
  ): Observable<IBaseResponse<TournamentEntity>>;
}
