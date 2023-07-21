import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { MatchesState } from './matches.states';

export const selectMatchFeature = (state: AppState) => state.matches;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectMatchFeature,
    (state: MatchesState) => state.transactions[transactionId]
  );

export const selectMatches = createSelector(
  selectMatchFeature,
  (state: MatchesState) => Object.values(state.matches)
  // .sort((a, b) => {
  // return moment(a.match.date).isAfter(moment(b.match.date)) ? 1 : -1;
  // })
);
export const selectMatchesByTournament = (tournamentId: Id) =>
  createSelector(
    selectMatchFeature,
    (state: MatchesState) =>
      Object.values(state.matches)
        .filter((x) => x.tournamentId === tournamentId)
        .map((x) => x.match)
    // .sort((a, b) => {
    // return moment(a.match.date).isAfter(moment(b.match.date)) ? 1 : -1;
    // })
  );

export const selectMatchesByGroup = (groupId: Id) =>
  createSelector(
    selectMatchFeature,
    (state: MatchesState) =>
      Object.values(state.matches).filter((m) => {
        return m.groupId == groupId;
      })
    // .sort((a, b) => {
    // return moment(a.match.date).isAfter(moment(b.match.date)) ? 1 : -1;
    // })
  );
