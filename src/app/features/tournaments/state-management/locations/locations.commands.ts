import { Id } from '@deporty-org/entities/general';
import { Coordinate} from '@deporty-org/entities/locations/location.entity';
import { createAction, props } from '@ngrx/store';

export const GetLocationByIdCommand = createAction(
  '[GeneralTournamentDetailComponent] GetLocationByIdCommand',
  props<{ locationId: Id }>()
);

export const GetLocationsByIdsCommand = createAction(
  '[TournamentDetailComponent] GetLocationsByIdsCommand',
  props<{
    ids: Id[];
  }>()
);
export const GetLocationsByRatioCommand = createAction(
  '[XX] GetLocationsByRatioCommand',
  props<{
    origin: Coordinate;
    ratio: number;
  }>()
);

export const ClearLocationsByRatiosCommand = createAction(
  '[TournamentsEffects] ClearLocationsByRatiosCommand'
);
