import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrganizationAdapter } from './organization.adapter';

@Injectable()
export class OrganizationService extends OrganizationAdapter {
  static collection = 'organizations';

  constructor(private http: HttpClient) {
    super();
  }
  getOrganizations(
    pageNumber: number,
    pageSize: number
  ): Observable<IBaseResponse<OrganizationEntity[]>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}`;
    return this.http.get<IBaseResponse<Array<OrganizationEntity>>>(path, {
      params: {
        pageNumber,
        pageSize,
      },
    });
  }

  getOrganizationById(
    organizationId: string
  ): Observable<IBaseResponse<OrganizationEntity>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/${organizationId}`;
    return this.http.get<IBaseResponse<OrganizationEntity>>(path);
  }

  getTournamentLayoutsByOrganizationId(
    organizationId: string
  ): Observable<IBaseResponse<TournamentLayoutEntity[]>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/${organizationId}/tournament-layouts`;
    return this.http.get<IBaseResponse<Array<TournamentLayoutEntity>>>(path);
  }

  getTournamentLayoutById(
    organizationId: string,
    tournamentLayoutId: string
  ): Observable<IBaseResponse<TournamentLayoutEntity>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/${organizationId}/tournament-layout/${tournamentLayoutId}`;
    return this.http.get<IBaseResponse<TournamentLayoutEntity>>(path);
  }

  getOrganizationsByMemberEmail(
    email: string
  ): Observable<IBaseResponse<Array<OrganizationEntity>>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/member/email/${email}`;
    return this.http.get<IBaseResponse<Array<OrganizationEntity>>>(path);
  }

  createTournamentLayout(
    tournamentLayout: TournamentLayoutEntity
  ): Observable<IBaseResponse<TournamentLayoutEntity>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/tournament-layout`;
    return this.http.post<IBaseResponse<TournamentLayoutEntity>>(
      path,
      tournamentLayout
    );
  }
  editTournamentLayout(
    tournamentLayout: TournamentLayoutEntity
  ): Observable<IBaseResponse<TournamentLayoutEntity>> {
    const path = `${environment.serverEndpoint}/${OrganizationService.collection}/tournament-layout`;
    return this.http.patch<IBaseResponse<TournamentLayoutEntity>>(
      path,
      tournamentLayout
    );
  }
}
