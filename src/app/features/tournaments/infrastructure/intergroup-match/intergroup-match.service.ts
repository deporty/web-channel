import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  Id,
  IntergroupMatchEntity,
  MatchStatusType,
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
    teamBId: Id
  ): Observable<IBaseResponse<IntergroupMatchEntity>> {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match`;
    return this.httpClient.post<IBaseResponse<IntergroupMatchEntity>>(path, {
      tournamentId,
      fixtureStageId,
      teamAId,
      teamBId,
    });
  }

  deleteIntergroupMatch(
    tournamentId: string,
    fixtureStageId: string,
    intergroupMatchId: string
  ): Observable<IBaseResponse<Id>> {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match/${intergroupMatchId}`;
    return this.httpClient.delete<IBaseResponse<Id>>(path);
  }

  editIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    intergroupMatch: IntergroupMatchEntity
  ): Observable<IBaseResponse<IntergroupMatchEntity>> {
    const path = `${environment.serverEndpoint}/${IntegroupMatchService.collection}/${tournamentId}/fixture-stage/${fixtureStageId}/intergroup-match`;
    return this.httpClient.patch<IBaseResponse<IntergroupMatchEntity>>(
      path,
      intergroupMatch
    );
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
