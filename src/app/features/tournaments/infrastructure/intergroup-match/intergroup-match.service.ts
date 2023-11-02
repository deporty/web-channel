import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  Id,
  IntergroupMatchEntity,
  MatchStatusType,
  PositionsTable,
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IntegroupMatchAdapter } from '../../adapters/intergroup-match.adapter';

@Injectable()
export class IntegroupMatchService extends IntegroupMatchAdapter {
  static collection = 'tournaments';

  constructor(private httpClient: HttpClient) {
    super();
  }

  addIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    teamAId: Id,
    teamBId: Id,
    teamAGroupId: Id,
    teamBGroupId: Id
  ): Observable<IBaseResponse<IntergroupMatchEntity>> {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match`;
    return this.httpClient.post<IBaseResponse<IntergroupMatchEntity>>(path, {
      tournamentId,
      fixtureStageId,
      teamAId,
      teamBId,
      teamAGroupId,
      teamBGroupId,
    });
  }

  deleteIntergroupMatch(
    tournamentId: string,
    fixtureStageId: string,
    intergroupMatchId: string
  ): Observable<
    IBaseResponse<{
      intergroupMatchId: Id;
      positionsTable: { [index: Id]: PositionsTable };
    }>
  > {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match/${intergroupMatchId}`;
    return this.httpClient.delete<
      IBaseResponse<{
        intergroupMatchId: Id;
        positionsTable: { [index: Id]: PositionsTable };
      }>
    >(path);
  }

  editIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    intergroupMatch: IntergroupMatchEntity
  ): Observable<
    IBaseResponse<{
      intergroupMatch: IntergroupMatchEntity;
      positionsTable: { [index: Id]: PositionsTable };
    }>
  > {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match`;
    return this.httpClient.patch<
      IBaseResponse<{
        intergroupMatch: IntergroupMatchEntity;
        positionsTable: { [index: Id]: PositionsTable };
      }>
    >(path, intergroupMatch);
  }

  getIntergroupMatch(
    tournamentId: string,
    stageId: string,
    intergroupMatchId: string
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>> {
    throw Error();
  }
  getIntergroupMatches(
    tournamentId: Id,
    fixtureStageId: Id,
    states: MatchStatusType[]
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>> {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match`;
    return this.httpClient.get<IBaseResponse<IntergroupMatchEntity[]>>(path, {
      params: {
        states,
      },
    });
  }
}
