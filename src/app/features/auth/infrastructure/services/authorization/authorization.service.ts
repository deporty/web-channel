import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  Id,
  ResourceEntity
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthorizationService {
  static collection = 'authorization';

  constructor(private httpClient: HttpClient) {}

  getResourcesByRoles(
    roles: Id[]
  ): Observable<IBaseResponse<ResourceEntity[]>> {
    const path = `${environment.serverEndpoint}/${AuthorizationService.collection}/role/get-resources`;

    return this.httpClient.get<IBaseResponse<ResourceEntity[]>>(path, {
      params: {
        roles: roles,
      },
    });
  }

  getToken(email: string): Observable<IBaseResponse<string>> {
    const path = `${environment.serverEndpoint}/${AuthorizationService.collection}/get-token/${email}`;

    return this.httpClient.get<IBaseResponse<string>>(path);
  }
}
