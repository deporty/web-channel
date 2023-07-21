import { Id } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { createAction, props } from '@ngrx/store';

export const UpdatedLocationEvent = createAction(
  '[TournamentsEffects] UpdatedLocationEvent',
  props<{ match: LocationEntity }>()
);

export const CreatedLocationEvent = createAction(
  '[TournamentsEffects] CreatedLocationEvent',
  props<{
    tournamentId: Id;
    fixtureStageId: Id;
    groupId: Id;
    match: LocationEntity;
  }>()
);
export const ConsultedLocationsEvent = createAction(
  '[TournamentsEffects] ConsultedLocationsEvent',
  props<{
    locations: LocationEntity[];
  }>()
);
export const ConsultedLocationsByRatioEvent = createAction(
  '[TournamentsEffects] ConsultedLocationsByRatioEvent',
  props<{
    locations: LocationEntity[];
    ratio: number;
  }>()
);
