import { state } from '@angular/animations';
import { Id } from '@deporty-org/entities/general';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { teamsKey } from './teams.reducer';
import { TeamsState } from './teams.states';

export const selectTeamsFeature = createFeatureSelector<TeamsState>(teamsKey);

export const selectTeams = createSelector(
  selectTeamsFeature,
  (state: TeamsState) => Object.values(state.teams)
);

export const selectTeamById = (teamId: Id) =>
  createSelector(selectTeamsFeature, (state: TeamsState) => {
    return state.teams[teamId];
  });
export const selectSportById = (sportId: Id) =>
  createSelector(
    selectTeamsFeature,
    (state: TeamsState) => state.sports[sportId]
  );
export const selectTeamWithMembersById = (teamId: Id) =>
  createSelector(selectTeamsFeature, (state: TeamsState) => {
    return {
      team: state.teams[teamId],
      members: state.teamMembers[teamId]
        ? state.teamMembers[teamId].map((x) => x.member)
        : [],
    };
  });

export const selectTeamMembersByTeamId = (teamId: Id) =>
  createSelector(
    selectTeamsFeature,
    (state: TeamsState) => state.teamMembers[teamId]
  );
export const selectMemberById = (teamId: Id, memberId: Id) =>
  createSelector(selectTeamsFeature, (state: TeamsState) =>
    state.teamMembers[teamId]
      ?.filter((md) => {
        return md.member.id == memberId;
      })
      .pop()
  );
export const selectFilteredTeams = createSelector(
  selectTeamsFeature,
  (state: TeamsState) => state.filteredTeams
);

export const selectCurrentTeamMembers = createSelector(
  selectTeamsFeature,
  (state: TeamsState) => state.currentMembers
);
