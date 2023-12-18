import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBaseResponse,
  Id,
  ResourceEntity,
  TournamentEntity,
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class ResourcesContract {
  abstract gerResources(): Observable<IBaseResponse<ResourceEntity[]>>;
}

@Injectable()
export class ResourceService extends ResourcesContract {
  static collection = 'authorization/resources';

  constructor(private httpClient: HttpClient) {
    super();
  }
  gerResources(): Observable<IBaseResponse<ResourceEntity[]>> {
    const path = `${environment.serverEndpoint}/${ResourceService.collection}`;

    return this.httpClient.get<IBaseResponse<ResourceEntity[]>>(path);
  }
}
