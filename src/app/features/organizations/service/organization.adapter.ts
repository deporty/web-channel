import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';

export abstract class OrganizationAdapter {
  static collection = 'organizations';

  abstract getOrganizationsByMemberEmail(
    email: string
  ): Observable<IBaseResponse<Array<OrganizationEntity>>>;

  abstract getTournamentLayoutsByOrganizationId(
    organizationId: Id
  ): Observable<IBaseResponse<Array<TournamentLayoutEntity>>>;
  abstract getTournamentLayoutById(
    organizationId: Id,
    tournamentLayoutId: Id
  ): Observable<IBaseResponse<TournamentLayoutEntity>>;

  abstract getOrganizations(
    pageNumber: number,
    pageSize: number
  ): Observable<IBaseResponse<Array<OrganizationEntity>>>;

  abstract getOrganizationById(
    organizationId: Id
  ): Observable<IBaseResponse<OrganizationEntity>>;

  abstract createTournamentLayout(
    tournamentLayout: TournamentLayoutEntity
  ): Observable<IBaseResponse<TournamentLayoutEntity>>;
  abstract editTournamentLayout(
    tournamentLayout: TournamentLayoutEntity
  ): Observable<IBaseResponse<TournamentLayoutEntity>>;
}
