import { createReducer, on } from '@ngrx/store';
import {
  ConsultedIntergroupMatchesEvent,
  DeletedIntergroupMatchEvent,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
} from './intergroup-matches.actions';
import { IntergroupMatchesState } from './intergroup-matches.states';

export const IntergroupMatchesKey = 'intergroup-matches';
export const initialState: IntergroupMatchesState = {
  transactions: {},
  intergroupMatches: {},
};

export const IntergroupMatchesReducer = createReducer<
  IntergroupMatchesState,
  any
>(
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

  on(
    ConsultedIntergroupMatchesEvent,
    (state, { intergroupMatches, tournamentId, fixtureStageId }) => {
      const _intergroupMatches = { ...state.intergroupMatches };
      if (intergroupMatches) {
        for (const intergroupMatch of intergroupMatches) {
          _intergroupMatches[intergroupMatch.id!] = {
            intergroupMatch: intergroupMatch,
            fixtureStageId,
            tournamentId,
          };
        }
      }

      return {
        ...state,
        intergroupMatches: _intergroupMatches,
      };
    }
  ),
  on(DeletedIntergroupMatchEvent, (state, { intergroupMatchId }) => {
    const intergroupMatchTemp: any = {};

    for (const ___intergroupMatch in state.intergroupMatches) {
      const __intergroupMatch = state.intergroupMatches[___intergroupMatch];

      if (___intergroupMatch !== intergroupMatchId) {
        intergroupMatchTemp[___intergroupMatch] = __intergroupMatch;
      }
    }

    return { ...state, intergroupMatches: intergroupMatchTemp };
  })
);
