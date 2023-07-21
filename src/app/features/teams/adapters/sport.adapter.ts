import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  SportEntity
} from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';

export abstract class SportAdapter {
  abstract getSportById(sportId: Id): Observable<IBaseResponse<SportEntity>>;
}
