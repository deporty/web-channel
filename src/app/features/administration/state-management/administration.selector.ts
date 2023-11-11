import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { administrationKey } from './administration.reducer';
import { AdministrationState } from './administration.states';


export const selectAdministrationFeature =
  createFeatureSelector<AdministrationState>(administrationKey);

export const selectInvoicesCount = createSelector(
  selectAdministrationFeature,
  (state: AdministrationState) => state.tournaments
);
