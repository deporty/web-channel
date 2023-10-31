import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { GroupsState } from './groups.states';

export const selectGroupsFeature = (state: AppState) => state.groups;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectGroupsFeature,
    (state: GroupsState) => state.transactions[transactionId]
  );

export const selectGroupsByFixtureStageId = (fixtureStageId: Id) =>
  createSelector(selectGroupsFeature, (state: GroupsState) =>
    Object.values(state.groups)
      .filter((x) => {
        return x.group.fixtureStageId == fixtureStageId;
      })
      .map((x) => x.group)
      .sort((a, b) => {
        return a.order > b.order ? 1 : -1;
      })
  );
export const selectGroups = createSelector(
  selectGroupsFeature,
  (state: GroupsState) =>
    Object.values(state.groups)
      .map((x) => x.group)
      .sort((a, b) => {
        return a.order > b.order ? 1 : -1;
      })
);

export const selectGroupById = (id: Id) =>
  createSelector(selectGroupsFeature, (state: GroupsState) => state.groups[id]);

export const selectGroupByLabel = (label: string) =>
  createSelector(selectGroupsFeature, (state: GroupsState) =>
    Object.values(state.groups)
      .filter((x) => x.group.label == label)
      .pop()
  );

// export const selectPositionTableByGroup = (groupId: Id) =>
//   createSelector(
//     selectGroupsFeature,
//     (state: GroupsState) => state.positionsTables[groupId]
//   );

export const selectGroupByFixtureStageId = (fixtureStageId: Id) =>
  createSelector(selectGroupsFeature, (state: GroupsState) =>
    Object.values(state.groups)
      .map((x) => x.group)
      .filter((x) => x.fixtureStageId === fixtureStageId)
      .sort((a, b) => {
        return a.order > b.order ? 1 : -1;
      })
  );
export const selectTeamsByFixtureStageId = (fixtureStageId: Id) =>
  createSelector(selectGroupsFeature, (state: GroupsState) =>
    Object.values(state.groups)
      .map((x) => x.group)
      .filter((x) => x.fixtureStageId === fixtureStageId)
      .map((x) => x.teamIds)
      .reduce((prev, curr) => {
        prev.push(...curr);
        return prev;
      }, [])
  );
export const selectGroupByWhereExistTeamId = (teamId: Id) =>
  createSelector(
    selectGroupsFeature,
    (state: GroupsState) =>
      Object.values(state.groups)
        .map((x) => x.group)
        .filter((x) => x.teamIds.includes(teamId))[0]
  );
