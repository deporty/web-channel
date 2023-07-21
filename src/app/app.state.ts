import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InvoicesReducer } from './features/invoices/invoices.reducer';
import { InvoicesState } from './features/invoices/invoices.states';
import { TeamsReducer } from './features/teams/state-management/teams.reducer';
import { TeamsState } from './features/teams/state-management/teams.states';
import { FixtureStagesReducer } from './features/tournaments/state-management/fixture-stages/fixture-stages.reducer';
import { FixtureStagesState } from './features/tournaments/state-management/fixture-stages/fixture-stages.states';
import { GroupsReducer } from './features/tournaments/state-management/groups/groups.reducer';
import { GroupsState } from './features/tournaments/state-management/groups/groups.states';
import { LocationsReducer } from './features/tournaments/state-management/locations/locations.reducer';
import { LocationsState } from './features/tournaments/state-management/locations/locations.states';
import { MatchesReducer } from './features/tournaments/state-management/matches/matches.reducer';
import { MatchesState } from './features/tournaments/state-management/matches/matches.states';
import { TournamentsReducer } from './features/tournaments/state-management/tournaments/tournaments.reducer';
import { TournamentsState } from './features/tournaments/state-management/tournaments/tournaments.states';
import { OrganizationsState } from './features/organizations/organizations.states';
import { OrganizationsReducer } from './features/organizations/organizations.reducer';
import { UserState } from './features/users/state-management/users.states';
import { UserReducer } from './features/users/state-management/users.reducer';
import { MainDrawState } from './features/tournaments/state-management/main-draw/main-draw.state';
import { MainDrawsReducer } from './features/tournaments/state-management/main-draw/main-draw.reducer';
import { IntergroupMatchesReducer } from './features/tournaments/state-management/intergroup-matches/intergroup-matches.reducer';
import { IntergroupMatchesState } from './features/tournaments/state-management/intergroup-matches/intergroup-matches.states';

export default interface AppState {
  organizations: OrganizationsState;
  invoices: InvoicesState;
  teams: TeamsState;
  tournaments: TournamentsState;
  fixtureStages: FixtureStagesState;
  mainDraws: MainDrawState;
  groups: GroupsState;
  matches: MatchesState;
  locations: LocationsState;
  users: UserState;
  intergroupMatches: IntergroupMatchesState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  invoices: InvoicesReducer,
  teams: TeamsReducer,
  organizations: OrganizationsReducer,
  tournaments: TournamentsReducer,
  fixtureStages: FixtureStagesReducer,
  groups: GroupsReducer,
  matches: MatchesReducer,
  locations: LocationsReducer,
  users: UserReducer,
  mainDraws: MainDrawsReducer,
  intergroupMatches: IntergroupMatchesReducer,
};

export const metaReducers: MetaReducer<any>[] = [];
