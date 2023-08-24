import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  FixtureStageEntity,
  GroupEntity,
  IntergroupMatchEntity,
  MatchEntity,
  MatchStatusType,
  NodeMatchEntity,
  PositionsTable,
  RegisteredTeamEntity,
  TournamentEntity,
  TournamentStatusType,
} from '@deporty-org/entities/tournaments';
import { RegisteredTeamStatus } from '@deporty-org/entities/tournaments/registered-teams.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TournamentAdapter } from '../../adapters/tournament.adapter';

@Injectable()
export class TournamentService extends TournamentAdapter {
  createNodeMatch(
    nodeMatch: NodeMatchEntity
  ): Observable<IBaseResponse<NodeMatchEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${nodeMatch.tournamentId}/node-match`;
    return this.httpClient.post<IBaseResponse<NodeMatchEntity>>(path, {
      ...nodeMatch,
    });
  }
  publishAllMatchesInGroupCommand(
    tournamentId: string,
    fixtureStageId: string,
    groupId: string
  ): Observable<IBaseResponse<MatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/publish-all-matches`;

    return this.httpClient.post<IBaseResponse<MatchEntity[]>>(path, {});
  }
  static collection = 'tournaments';

  constructor(private httpClient: HttpClient) {
    super();
  }

  addMatchToGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teamAId: Id,
    teamBId: Id
  ): Observable<IBaseResponse<MatchEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/match`;

    return this.httpClient.post<IBaseResponse<MatchEntity>>(path, {
      teamAId,
      teamBId,
    });
  }

  //Terminado
  addTeamsToGroupTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teams: Id[]
  ): Observable<IBaseResponse<GroupEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/add-teams-into-group`;

    return this.httpClient.put<IBaseResponse<any>>(path, {
      tournamentId,
      fixtureStageId,
      groupId,
      teamIds: teams,
    });
  }

  //Terminado
  addTeamsToTournament(
    tournamentId: string,
    teamIds: string[]
  ): Observable<IBaseResponse<RegisteredTeamEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/add-team`;
    return this.httpClient.put<IBaseResponse<RegisteredTeamEntity[]>>(path, {
      tournamentId,
      teamIds,
    });
  }

  createFixtureStage(
    fixtureStage: FixtureStageEntity
  ): Observable<IBaseResponse<FixtureStageEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${fixtureStage.tournamentId}/fixture-stage`;
    return this.httpClient.post<IBaseResponse<FixtureStageEntity>>(
      path,
      fixtureStage
    );
  }

  createGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupLabel: string,
    groupOrder: number
  ): Observable<IBaseResponse<GroupEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group`;
    return this.httpClient.post<IBaseResponse<GroupEntity>>(path, {
      teamIds: [],
      label: groupLabel,
      order: groupOrder,
      fixtureStageId,
    });
  }

  createTournament(
    tournament: TournamentEntity
  ): Observable<IBaseResponse<TournamentEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}`;
    return this.httpClient.post<IBaseResponse<TournamentEntity>>(
      path,
      tournament
    );
  }

  deleteFixtureStage(
    tournamentId: Id,
    fixtureStageId: Id
  ): Observable<IBaseResponse<Id>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}`;
    return this.httpClient.delete<IBaseResponse<Id>>(path);
  }

  deleteGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id
  ): Observable<IBaseResponse<Id>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}`;
    return this.httpClient.delete<IBaseResponse<Id>>(path);
  }

  deleteRegisteredTeam(
    tournamentId: string,
    registeredTeamId: string
  ): Observable<IBaseResponse<string>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/registered-teams/${registeredTeamId}`;
    return this.httpClient.delete<IBaseResponse<Id>>(path);
  }

  deleteTeamsInGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    teamIds: Id[]
  ): Observable<IBaseResponse<GroupEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/teams`;
    return this.httpClient.delete<IBaseResponse<GroupEntity>>(path, {
      body: teamIds,
    });
  }

  deleteTournament(
    tournamentId: TournamentEntity
  ): Observable<IBaseResponse<TournamentEntity | null>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}`;
    return this.httpClient.delete<IBaseResponse<TournamentEntity | null>>(path);
  }

  downloadMatchSheet(
    tournamentId: string,
    match: MatchEntity
  ): Observable<IBaseResponse<any>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/match-sheet`;
    return this.httpClient.put<IBaseResponse<void>>(path, {
      tournamentId,
      match,
    });
  }

  //Terminado
  editMatchOfGroupInsideTournament(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id,
    match: MatchEntity
  ): Observable<
    IBaseResponse<{ match: MatchEntity; positionsTable: PositionsTable }>
  > {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/match`;

    return this.httpClient.put<
      IBaseResponse<{ match: MatchEntity; positionsTable: PositionsTable }>
    >(path, match);
  }

  editNodeMatch(
    tournamentId: string,
    nodeMatch: NodeMatchEntity
  ): Observable<IBaseResponse<NodeMatchEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/node-match/${nodeMatch.id}`;
    return this.httpClient.put<IBaseResponse<NodeMatchEntity>>(path, {
      tournamentId,
      nodeMatch,
    });
  }

  generateMainDraw(
    tournamentId: string
  ): Observable<IBaseResponse<NodeMatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/generate-main-draw`;

    return this.httpClient.put<IBaseResponse<NodeMatchEntity[]>>(path, {});
  }

  //Terminado
  getAvailableTeamsToAdd(
    tournamentId: string,
    member?: string,
    name?: string,
    category?: string
  ): Observable<IBaseResponse<TeamEntity[]>> {
    const params: any = {};
    if (name) params['name'] = name;
    if (member) params['member'] = member;
    if (category) params['category'] = category;

    const path = `${environment.serverEndpoint}/${TournamentService.collection}/available-teams-to-add/${tournamentId}`;
    return this.httpClient.get<IBaseResponse<TeamEntity[]>>(path, {
      params,
    });
  }

  getCurrentTournamentsCommand(): Observable<
    IBaseResponse<TournamentEntity[]>
  > {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/current-tournaments`;
    return this.httpClient.get<IBaseResponse<TournamentEntity[]>>(path);
  }

  //No Terminado
  getFixtureStagesByTournament(
    tournamentId: string
  ): Observable<IBaseResponse<FixtureStageEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stages`;
    return this.httpClient.get<IBaseResponse<FixtureStageEntity[]>>(path);
  }

  getGroupSpecificationInsideTournament(
    tournamentId: string,
    stageId: string,
    groupLabel: string
  ): Observable<IBaseResponse<GroupEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/stage/group`;
    return this.httpClient.get<IBaseResponse<GroupEntity>>(path, {
      params: {
        tournamentId,
        stageId,
        groupLabel,
      },
    });
  }

  getGroupedMatches(
    tournamentId: string,
    stageId: string
  ): Observable<IBaseResponse<any>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/grouped-matches`;
    return this.httpClient.get<IBaseResponse<any>>(path, {
      params: {
        tournamentId,
        stageId,
      },
    });
  }

  getGroupedMatchesByTournamentById(
    tournamentId: string
  ): Observable<IBaseResponse<any>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/grouped-matches`;
    return this.httpClient.get<IBaseResponse<any>>(path);
  }

  getGroupsByFixtureStage(
    tournamentId: string,
    stageId: string
  ): Observable<IBaseResponse<GroupEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${stageId}/groups`;
    return this.httpClient.get<IBaseResponse<GroupEntity[]>>(path);
  }

  //No Terminado
  getGroupsMatchesByTournamentId(
    tournamentId: string,
    stageIndex: number,
    groupIndex: number
  ): Observable<MatchEntity[]> {
    throw new Error('Method not implemented.');
  }

  getIntergroupMatch(
    tournamentId: string,
    stageId: string,
    intergroupMatchId: string
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/intergroup-match`;
    return this.httpClient.get<IBaseResponse<IntergroupMatchEntity[]>>(path, {
      params: {
        tournamentId,
        stageId,
        intergroupMatchId,
      },
    });
  }

  getMainDrawByTournament(
    tournamentId: string
  ): Observable<IBaseResponse<NodeMatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/main-draw`;
    return this.httpClient.get<IBaseResponse<any>>(path, {
      params: {
        tournamentId,
      },
    });
  }

  //Terminado
  getMarkersTableByTornament(id: string): Observable<IBaseResponse<any[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/markers-table/${id}`;
    return this.httpClient.get<IBaseResponse<any[]>>(path);
  }

  getMatchInsideGroup(
    tournamentId: string,
    stageId: string,
    groupLabel: string,
    teamAId: string,
    teamBId: string
  ): Observable<IBaseResponse<MatchEntity | undefined>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/match-inside-group`;
    return this.httpClient.get<IBaseResponse<any>>(path, {
      params: {
        tournamentId,
        stageId,
        groupLabel,
        teamAId,
        teamBId,
      },
    });
  }

  getMatchesByGroup(
    tournamentId: string,
    fixtureStageId: string,
    groupId: string,
    states: MatchStatusType[]
  ): Observable<IBaseResponse<MatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/matches`;
    return this.httpClient.get<IBaseResponse<MatchEntity[]>>(path, {
      params: {
        states,
      },
    });
  }

  getNodeMatchById(
    tournamentId: string,
    nodeMatchId: string
  ): Observable<IBaseResponse<NodeMatchEntity | undefined>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/main-draw/node-match`;
    return this.httpClient.get<IBaseResponse<any>>(path, {
      params: {
        tournamentId,
        nodeMatchId,
      },
    });
  }

  getPositionTables(
    tournamentId: Id,
    fixtureStageId: Id,
    groupId: Id
  ): Observable<IBaseResponse<any>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/group/${groupId}/positions-table`;
    return this.httpClient.get<IBaseResponse<void>>(path);
  }

  getRegisteredTeams(
    tournamentId: string
  ): Observable<IBaseResponse<RegisteredTeamEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/registered-teams`;
    return this.httpClient.get<IBaseResponse<RegisteredTeamEntity[]>>(path);
  }

  getTournamentFixtureById(
    id: string
  ): Observable<IBaseResponse<FixtureStageEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/fixture/${id}`;
    return this.httpClient.get<IBaseResponse<FixtureStageEntity>>(path);
  }

  //Terminado
  getTournamentSummaryById(
    id: string
  ): Observable<IBaseResponse<TournamentEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${id}`;
    return this.httpClient.get<IBaseResponse<TournamentEntity>>(path);
  }

  //Terminado
  getTournamentsByOrganizationAndTournamentLayout(
    organizationId: Id,
    tournamentLayoutId: Id,
    includeDraft: boolean
  ): Observable<IBaseResponse<TournamentEntity[]>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/by-organization-and-tournament-layout`;
    return this.httpClient.get<IBaseResponse<TournamentEntity[]>>(path, {
      params: {
        organizationId,
        tournamentLayoutId,
        includeDraft,
      },
    });
  }

  modifyRegisteredTeamStatus(
    tournamentId: Id,
    registeredTeamId: Id,
    status: RegisteredTeamStatus
  ): Observable<IBaseResponse<RegisteredTeamEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/registered-team/${registeredTeamId}/modify-status`;
    return this.httpClient.patch<IBaseResponse<RegisteredTeamEntity>>(path, {
      status,
    });
  }

  modifyTournamentLocations(
    tournamentId: Id,
    locations: Id[]
  ): Observable<IBaseResponse<TournamentEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/modify-locations`;
    return this.httpClient.patch<IBaseResponse<TournamentEntity>>(path, {
      locations,
    });
  }

  modifyTournamentReferees(
    tournamentId: string,
    refereeIds: string[]
  ): Observable<IBaseResponse<TournamentEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/modify-referees`;
    return this.httpClient.patch<IBaseResponse<TournamentEntity>>(path, {
      refereeIds,
    });
  }

  modifyTournamentStatus(
    tournamentId: string,
    status: TournamentStatusType
  ): Observable<IBaseResponse<TournamentEntity>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/${tournamentId}/modify-status`;
    return this.httpClient.patch<IBaseResponse<TournamentEntity>>(path, {
      status,
    });
  }

  validateSchema(
    schema: TournamentLayoutSchema
  ): Observable<IBaseResponse<boolean>> {
    const path = `${environment.serverEndpoint}/${TournamentService.collection}/is-a-schema-valid-for-main-draw`;
    return this.httpClient.post<IBaseResponse<boolean>>(path, {
      ...schema,
    });
  }
}
