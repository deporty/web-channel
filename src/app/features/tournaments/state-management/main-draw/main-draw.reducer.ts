import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import { MainDrawState } from './main-draw.state';
import {
  ConsultedNodeMatchesEvent,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
} from './main-draw.events';
import { NodeMatchEntity } from '@deporty-org/entities';

export const fixtureStagesKey = 'main-draw';
export const initialState: MainDrawState = {
  transactions: {},
  nodeMatches: {},
};

export const MainDrawsReducer = createReducer<MainDrawState, any>(
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

  on(ConsultedNodeMatchesEvent, (state, { nodeMatches, tournamentId }) => {
    const matches: {
      [tournamentId: string]: {
        [nodeMatchId: string]: NodeMatchEntity;
      };
    } = { ...state.nodeMatches };
    
    if (!matches[tournamentId]) {
      matches[tournamentId] = {};
    }

    const temp: any = {};

    for (const nodeMatch of nodeMatches) {
      temp[nodeMatch.id!] = nodeMatch;
    }
    const fullNodeMatches = {
      ...matches[tournamentId],
      ...temp,
    };
    return {
      ...state,
      nodeMatches: {
        ...state.nodeMatches,
        [tournamentId]: fullNodeMatches,
      },
    };
  })
  // on(DeletedFixtureStagesEvent, (state, { fixtureStageId }) => {
  //   const stages = { ...state.fixtureStages };
  //   const temp: any = {};

  //   for (const tournamentId in state.fixtureStages) {
  //     const fixtureStages = state.fixtureStages[tournamentId];

  //     const fixtureStageTemp: any = {};
  //     for (const _fixtureStageId in fixtureStages) {
  //       const fixtureStage = fixtureStages[_fixtureStageId];
  //       if (fixtureStage.id !== fixtureStageId) {
  //         fixtureStageTemp[fixtureStage.id!] = fixtureStage;
  //       }
  //     }

  //     temp[tournamentId] = fixtureStageTemp;
  //   }

  //   return { ...state, fixtureStages: temp };
  // })
);
