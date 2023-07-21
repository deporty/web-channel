import { Id } from '@deporty-org/entities/general';
import { createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { FixtureStagesState } from './fixture-stages.states';

export const selectFixtureStagesFeature = (state: AppState) =>
  state.fixtureStages;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectFixtureStagesFeature,
    (state: FixtureStagesState) => state.transactions[transactionId]
  );

export const selectFixtureStages = createSelector(
  selectFixtureStagesFeature,
  (state: FixtureStagesState) => Object.values(state)
);

export const selectFixtureStagesByTournamentId = (tournamentId: Id) =>
  createSelector(selectFixtureStagesFeature, (state: FixtureStagesState) =>
    state.fixtureStages[tournamentId]
      ? Object.values(state.fixtureStages[tournamentId]).filter(
          (x) => x.tournamentId === tournamentId
        )
      : undefined
  );
