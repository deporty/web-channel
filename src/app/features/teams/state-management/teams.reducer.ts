import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import { GetTeamsByFiltersCommand } from './teams.commands';
import {
  ConsultedFilteredTeamsEvent,
  ConsultedMemberEvent,
  ConsultedSportByIdEvent,
  ConsultedTeamByIdEvent,
  ConsultedTeamMembersEvent,
  ConsultedTeamsEvent,
} from './teams.events';
import { TeamsState } from './teams.states';
import { MemberDescriptionType } from '@deporty-org/entities';

export const teamsKey = 'teams';
export const initialState: TeamsState = {
  teams: {},
  sports: {},
  teamMembers: {},
};

export const TeamsReducer = createReducer<TeamsState, any>(
  initialState,

  on(ConsultedTeamsEvent, (state, { teams }) => {
    const oldTeams = { ...state.teams };

    for (const team of teams) {
      oldTeams[team.id!] = team;
    }
    let newState: TeamsState = { ...state, teams: oldTeams };
    return newState;
  }),
  on(ConsultedFilteredTeamsEvent, (state, { teams }) => {
    let newState: TeamsState = { ...state, filteredTeams: teams };
    return newState;
  }),
  on(ConsultedTeamMembersEvent, (state, { members, teamId }) => {
    let newState: TeamsState = {
      ...state,
      teamMembers: { ...state.teamMembers, [teamId]: members },
    };
    return newState;
  }),
  on(ConsultedMemberEvent, (state, { member, teamId }) => {
    let newState: TeamsState = {
      ...state,
      teamMembers: {
        ...state.teamMembers,
        [teamId]: [...(state.teamMembers[teamId] || []), member],
      },
    };
    return newState;
  }),
  on(ConsultedTeamByIdEvent, (state, { team }) => {
    let newState: TeamsState = { ...state };
    if (team) {
      newState.teams = {
        ...newState.teams,

        [team.id as Id]: team,
      };
    }
    return newState;
  }),
  on(ConsultedSportByIdEvent, (state, { sport }) => {
    let newState: TeamsState = { ...state };
    if (sport) {
      newState.sports = {
        ...newState.sports,
        [sport.id as Id]: sport,
      };
    }
    return newState;
  })
);
