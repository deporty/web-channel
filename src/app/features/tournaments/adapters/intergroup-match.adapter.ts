import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  MatchStatusType,
  IntergroupMatchEntity,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';

export abstract class IntegroupMatchAdapter {
  abstract addIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    teamAId: Id,
    teamBId: Id,
    teamAGroupId: Id,
    teamBGroupId: Id
  ): Observable<IBaseResponse<IntergroupMatchEntity>>;

  abstract editIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    intergroupMatch: IntergroupMatchEntity
  ): Observable<
    IBaseResponse<{
      intergroupMatch: IntergroupMatchEntity;
      positionsTable: { [index: Id]: PositionsTable };
    }>
  >;

  abstract getIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    intergroupMatchId: Id
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>>;
  abstract getIntergroupMatches(
    tournamentId: Id,
    fixtureStageId: Id,
    states: MatchStatusType[]
  ): Observable<IBaseResponse<IntergroupMatchEntity[]>>;
  abstract deleteIntergroupMatch(
    tournamentId: Id,
    fixtureStageId: Id,
    intergroupMatchId: Id
  ): Observable<IBaseResponse<{
    intergroupMatchId: Id;
    positionsTable: { [index: Id]: PositionsTable };
  }>>;
}
