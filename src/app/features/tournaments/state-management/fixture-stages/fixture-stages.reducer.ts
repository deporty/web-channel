import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import {
  TransactionDeletedEvent,
  TransactionResolvedEvent,
  ConsultedFixtureStagesEvent,
  DeletedFixtureStagesEvent,
} from './fixture-stages.actions';
import { FixtureStagesState } from './fixture-stages.states';

export const fixtureStagesKey = 'fixture-stages';
export const initialState: FixtureStagesState = {
  transactions: {},
  fixtureStages: {},
};

export const FixtureStagesReducer = createReducer<FixtureStagesState, any>(
  initialState,

  on(TransactionResolvedEvent, (state, { transactionId, meta }) => {
    const prevTransaction = state.transactions[transactionId];

    const newState = { ...state };
    if (!prevTransaction) {
      return {
        ...state,
        transactions: { ...state.transactions, [transactionId]: meta },
      };
    }
    return newState;
  }),
  on(TransactionDeletedEvent, (state, { transactionId }) => {
    const newState = { ...state };
    const transactions = { ...newState.transactions };

    delete transactions[transactionId];

    return {
      ...state,
      transactions,
    };
  }),

  on(ConsultedFixtureStagesEvent, (state, { fixtureStages, tournamentId }) => {
    const stages = { ...state.fixtureStages };
    if (!stages[tournamentId]) {
      stages[tournamentId] = {};
    }
    const temp: any = {};

    for (const fixtureStage of fixtureStages) {
      temp[fixtureStage.id!] = fixtureStage;
    }
    const fullFixtureStages = {
      ...stages[tournamentId],
      ...temp,
    };
    return {
      ...state,
      fixtureStages: {
        ...state.fixtureStages,
        [tournamentId]: fullFixtureStages,
      },
    };
  }),
  on(DeletedFixtureStagesEvent, (state, { fixtureStageId }) => {
    const stages = { ...state.fixtureStages };
    const temp: any = {};

    for (const tournamentId in state.fixtureStages) {
      const fixtureStages = state.fixtureStages[tournamentId];

      const fixtureStageTemp: any = {};
      for (const _fixtureStageId in fixtureStages) {
        const fixtureStage = fixtureStages[_fixtureStageId];
        if (fixtureStage.id !== fixtureStageId) {
          fixtureStageTemp[fixtureStage.id!] = fixtureStage;
        }
      }

      temp[tournamentId] = fixtureStageTemp;
    }
 

    return { ...state, fixtureStages: temp };
  })
);
