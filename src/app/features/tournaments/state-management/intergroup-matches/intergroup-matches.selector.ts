import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { IntergroupMatchesState } from './intergroup-matches.states';

export const selectIntergroupMatchesFeature = (state: AppState) =>
  state.intergroupMatches;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectIntergroupMatchesFeature,
    (state: IntergroupMatchesState) => state.transactions[transactionId]
  );

export const selectIntergroupMatches = createSelector(
  selectIntergroupMatchesFeature,
  (state: IntergroupMatchesState) => Object.values(state.intergroupMatches)
);
export const selectIntergroupMatchesByTournament = (tournamentId: Id) =>
  createSelector(
    selectIntergroupMatchesFeature,
    (state: IntergroupMatchesState) =>
      Object.values(state.intergroupMatches).filter(
        (x) => x.tournamentId === tournamentId
      ).map(z=>{
        return z.intergroupMatch
      })
  );

export const selectIntergroupMatchesByTournamentIdAndFixtureStageId = (
  tournamentId: Id,
  fixtureStageId: Id
) =>
  createSelector(
    selectIntergroupMatchesFeature,
    (state: IntergroupMatchesState) =>
      Object.values(state.intergroupMatches).filter(
        (x) =>
          x.fixtureStageId === fixtureStageId && x.tournamentId === tournamentId
      )
  );
