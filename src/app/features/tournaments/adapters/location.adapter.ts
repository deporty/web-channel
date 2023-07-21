import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';
import { Observable } from 'rxjs';

export abstract class LocationAdapter {
  abstract getLocationsByIds(
    ids: Id[]
  ): Observable<IBaseResponse<LocationEntity[]>>;
  abstract getLocationsByRatio(
    origin: Coordinate,
    ratio: number
  ): Observable<IBaseResponse<LocationEntity[]>>;
}
