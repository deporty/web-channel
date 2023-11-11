import { createReducer, on } from '@ngrx/store';
import { AdministrationState } from './administration.states';

export const administrationKey = 'administration';
export const initialState: AdministrationState = {};

export const AdministrationReducer = createReducer<AdministrationState, any>(
  initialState,


);
