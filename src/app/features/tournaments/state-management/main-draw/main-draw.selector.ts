import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { MainDrawState } from './main-draw.state';

export const selectMainDrawsFeature = (state: AppState) => state.mainDraws;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectMainDrawsFeature,
    (state: MainDrawState) => state.transactions[transactionId]
  );

export const selectMainDraws = createSelector(
  selectMainDrawsFeature,
  (state: MainDrawState) => Object.values(state)
);

export const selectMainDrawByTournamentId = (tournamentId: Id) =>
  createSelector(selectMainDrawsFeature, (state: MainDrawState) => {
    return state.nodeMatches[tournamentId]
      ? Object.values(state.nodeMatches[tournamentId])
      : undefined;
  });
