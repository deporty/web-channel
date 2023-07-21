import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  Id,
  PermissionEntity,
  ResourceEntity,
} from '@deporty-org/entities';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { app } from 'src/app/init-app';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthorizationService {
  static collection = 'authorization';
  constructor(private httpClient: HttpClient) {}

  getToken(email: string): Observable<IBaseResponse<string>> {
    const path = `${environment.serverEndpoint}/${AuthorizationService.collection}/get-token/${email}`;

    return this.httpClient.get<IBaseResponse<string>>(path);
  }

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
}
