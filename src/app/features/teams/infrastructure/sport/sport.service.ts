import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  SportEntity
} from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SportAdapter } from '../../adapters/sport.adapter';

@Injectable()
export class SportService extends SportAdapter {
  static collection = 'teams';
  constructor(private httpClient: HttpClient) {
    super();
  }

  getSportById(sportId: string): Observable<IBaseResponse<SportEntity>> {
    const path = `${environment.serverEndpoint}/${SportService.collection}/sport/${sportId}`;
    return this.httpClient.get<IBaseResponse<SportEntity>>(path);
  }
}
