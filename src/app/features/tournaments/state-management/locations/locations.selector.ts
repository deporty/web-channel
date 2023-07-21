import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { LocationsState } from './locations.states';

export const selectLocationFeature = (state: AppState) => state.locations;

export const selectLocationById = (locationId: Id) =>
  createSelector(selectLocationFeature, (state: LocationsState) => {
    return state.locations[locationId];
  });
export const selectLocationByIds = (locationIds: Id[]) =>
  createSelector(selectLocationFeature, (state: LocationsState) => {
    return Object.values(state.locations).filter((m) => {
      return locationIds.includes(m.id);
    });
  });
export const selectLocationByRatio = (ratio: number) =>
  createSelector(selectLocationFeature, (state: LocationsState) => {
    return state.locationsByRatio[ratio.toString()];
  });
