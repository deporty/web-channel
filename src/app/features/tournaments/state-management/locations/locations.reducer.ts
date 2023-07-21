import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import {
  ConsultedLocationsByRatioEvent,
  ConsultedLocationsEvent,
} from './locations.events';
import { LocationsState } from './locations.states';
import { ClearLocationsByRatiosCommand } from './locations.commands';

export const matchesKey = 'locations';
export const initialState: LocationsState = {
  locations: {},
  locationsByRatio: {},
  transactions: {},
};

export const LocationsReducer = createReducer<LocationsState, any>(
  initialState,

  on(ConsultedLocationsEvent, (state, { locations }) => {
    const prev = { ...state.locations };
    for (const location of locations) {
      prev[location.id as Id] = location;
    }
    return {
      ...state,
      locations: prev,
    };
  }),

  on(ConsultedLocationsByRatioEvent, (state, { locations, ratio }) => {
    const prev = { ...state.locationsByRatio, [ratio.toString()]: locations };
    return { ...state, locationsByRatio: prev };
  }),
  on(ClearLocationsByRatiosCommand, (state, {}) => {
    return { ...state, locationsByRatio: {} };
  })
);
