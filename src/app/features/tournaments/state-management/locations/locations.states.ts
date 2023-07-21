import { Id } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { MatchEntity } from '@deporty-org/entities/tournaments';

export interface LocationsState {
  locations: {
    [id: Id]: LocationEntity;
  };
  locationsByRatio: {
    [ratio: string]: LocationEntity[];
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
