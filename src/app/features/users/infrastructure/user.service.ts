import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROL } from '@deporty-org/entities/authorization';
import { IBaseResponse } from '@deporty-org/entities/general';
import { UserEntity } from '@deporty-org/entities/users';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAdapter } from './user.adapter';

@Injectable()
export class UserService extends UserAdapter {
  static collection = 'users';

  constructor(private http: HttpClient) {
    super();
  }

  getUserById(userId: string): Observable<IBaseResponse<UserEntity>> {
    const path = `${environment.serverEndpoint}/${UserService.collection}/${userId}`;
    return this.http.get<IBaseResponse<UserEntity>>(path);
  }

  getUsersByIds(userIds: string[]): Observable<IBaseResponse<UserEntity[]>> {

    const path = `${environment.serverEndpoint}/${UserService.collection}/ids`;
    return this.http.get<IBaseResponse<UserEntity[]>>(path, {
      params: {
        ids: userIds,
      },
    });
  }

  getUserByEmail(email: string): Observable<IBaseResponse<UserEntity>> {
    const path = `${environment.serverEndpoint}/${UserService.collection}/email/${email}`;
    return this.http.get<IBaseResponse<UserEntity>>(path);
  }

  getUsersByFilters(
    roles: string[],
    firstName: string,
    firstLastName: string,
    secondName: string,
    secondLastName: string
  ): Observable<IBaseResponse<UserEntity[]>> {
    const path = `${environment.serverEndpoint}/${UserService.collection}/filters`;

    return this.http.get<IBaseResponse<UserEntity[]>>(path, {
      params: {
        roles,
        firstName,
        firstLastName,
        secondName,
        secondLastName,
      },
    });
  }

  getUsersByRol(
    rol: ROL,
    pageNumber: number,
    pageSize: number
  ): Observable<IBaseResponse<UserEntity[]>> {
    const path = `${environment.serverEndpoint}/${UserService.collection}`;

    return this.http.get<IBaseResponse<UserEntity[]>>(path, {
      params: {
        rol,
        pageNumber,
        pageSize,
      },
    });
  }
}
