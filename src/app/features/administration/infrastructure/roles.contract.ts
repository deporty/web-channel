import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  RoleEntity
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class RolesContract {
  abstract getRoles(): Observable<IBaseResponse<RoleEntity[]>>;
}

@Injectable()
export class RolesService extends RolesContract {
  static collection = 'authorization/role';

  constructor(private httpClient: HttpClient) {
    super();
  }
  getRoles(): Observable<IBaseResponse<RoleEntity[]>> {
    const path = `${environment.serverEndpoint}/${RolesService.collection}s`;

    return this.httpClient.get<IBaseResponse<RoleEntity[]>>(path);
  }
}
