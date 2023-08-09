import { Id } from '@deporty-org/entities/general';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { organizationsKey } from './organizations.reducer';
import { OrganizationsState } from './organizations.states';

export const selectOrganizationFeature =
  createFeatureSelector<OrganizationsState>(organizationsKey);

export const selectMyCurrentOrganization = createSelector(
  selectOrganizationFeature,
  (state: OrganizationsState) => state.currentOrganization
);

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectOrganizationFeature,
    (state: OrganizationsState) => state.transactions[transactionId]
  );

export const selectMyOrganizations = createSelector(
  selectOrganizationFeature,
  (state: OrganizationsState) => state.myOrganizations
);
export const selectSchemaStatus = createSelector(
  selectOrganizationFeature,
  (state: OrganizationsState) => state.isValidSchema
);

export const selectTournamentsByTournamentLayout = (tournamentLayoutId: Id) =>
  createSelector(selectOrganizationFeature, (state: OrganizationsState) => {
    if (state.myTournaments) {
      if (state.tournamentLayouts[tournamentLayoutId]) {
        return Object.values(state.myTournaments).filter(
          (t) => t.tournamentLayoutId === tournamentLayoutId
        );
      }
    }
    return undefined;
  });

export const selectOrganizationById = (id: Id) =>
  createSelector(
    selectOrganizationFeature,
    (state: OrganizationsState) => state.organizations[id]
  );
export const selectTournamentLayoutsByOrganizationId = (organizationId: Id) =>
  createSelector(selectOrganizationFeature, (state: OrganizationsState) =>
    Object.entries(state.tournamentLayouts)
      .filter((e) => {
        return e[1].organizationId == organizationId;
      })
      .map((e) => {
        return e[1];
      })
  );
export const selectTournamentLayoutById = (id: Id) =>
  createSelector(
    selectOrganizationFeature,
    (state: OrganizationsState) => state.tournamentLayouts[id]
  );
export const selectTournamentLayoutByName = (name: string) =>
  createSelector(selectOrganizationFeature, (state: OrganizationsState) =>
    Object.values(state.tournamentLayouts)
      .filter((x) => x.name == name)
      .pop()
  );

export const selectTournamentCreatedFlag = createSelector(
  selectOrganizationFeature,
  (state: OrganizationsState) => state.tournamentCreatedFlag
);

export const selectOrganizations = createSelector(
  selectOrganizationFeature,
  (state: OrganizationsState) => state.organizations
);
