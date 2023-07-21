import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationAdapter } from '../../adapters/location.adapter';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';

@Injectable()
export class LocationService extends LocationAdapter {
  static collection = 'locations';

  constructor(private httpClient: HttpClient) {
    super();
  }

  getLocationsByIds(
    ids: string[]
  ): Observable<IBaseResponse<LocationEntity[]>> {
    const path = `${environment.serverEndpoint}/${LocationService.collection}/ids`;
    return this.httpClient.get<IBaseResponse<LocationEntity[]>>(path, {
      params: { ids: ids.join(',') },
    });
  }

  getLocationsByRatio(
    origin: Coordinate,
    ratio: number
  ): Observable<IBaseResponse<LocationEntity[]>> {
    const path = `${environment.serverEndpoint}/${LocationService.collection}/ratio`;

    return this.httpClient.get<IBaseResponse<LocationEntity[]>>(path, {
      params: {
        latitude: origin.latitude,
        longitude: origin.longitude,
        ratio,
      },
    });
  }
}
