import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { administrationKey } from './administration.reducer';
import { AdministrationState } from './administration.states';
import { Id } from '@deporty-org/entities';

export const selectAdministrationFeature =
  createFeatureSelector<AdministrationState>(administrationKey);

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectAdministrationFeature,
    (state: AdministrationState) => state.transactions[transactionId]
  );

export const selectRoles = createSelector(
  selectAdministrationFeature,
  (state: AdministrationState) => state.roles
);

export const selectPermissions = createSelector(
  selectAdministrationFeature,
  (state: AdministrationState) => state.permissions
);

export const selectPermissionsByIds = (ids: Id[]) =>
  createSelector(selectAdministrationFeature, (state: AdministrationState) =>
    state.permissions
      ? Object.values(state.permissions).filter((permission) => {
          return ids.includes(permission.id!);
        })
      : null
  );

export const selectResources = createSelector(
  selectAdministrationFeature,
  (state: AdministrationState) => state.resources
);

export const selectResourcesByIds = (ids: Id[]) =>
  createSelector(selectAdministrationFeature, (state: AdministrationState) =>
    state.resources
      ? Object.values(state.resources).filter((resource) => {
          return ids.includes(resource.id!);
        })
      : null
  );
