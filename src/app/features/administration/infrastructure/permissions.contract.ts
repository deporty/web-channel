import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  PermissionEntity
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class PermissionsContract {
  abstract getPermissions(): Observable<IBaseResponse<PermissionEntity[]>>;
}

@Injectable()
export class PermissionsService extends PermissionsContract {
  static collection = 'authorization/permissions';

  constructor(private httpClient: HttpClient) {
    super();
  }
  getPermissions(): Observable<IBaseResponse<PermissionEntity[]>> {
    const path = `${environment.serverEndpoint}/${PermissionsService.collection}`;

    return this.httpClient.get<IBaseResponse<PermissionEntity[]>>(path);
  }
}
