import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import {
  ConsultedMatchsEvent,
  CreatedMatchEvent,
  DeleteMatchesByGroupIdCommand,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
  UpdatedMatchEvent,
} from './matches.actions';
import { MatchesState } from './matches.states';

export const matchesKey = 'matches';
export const initialState: MatchesState = {
  matches: {},
  transactions: {},
};

export const MatchesReducer = createReducer<MatchesState, any>(
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
    ConsultedMatchsEvent,
    (state, { tournamentId, fixtureStageId, groupId, matches }) => {
      const prev = { ...state.matches };
      for (const match of matches) {
        prev[match.id as Id] = { match, tournamentId, fixtureStageId, groupId };
      }
      return { ...state, matches: prev };
    }
  ),
  on(
    DeleteMatchesByGroupIdCommand,
    (state, { tournamentId, fixtureStageId, groupId }) => {
      const prev: any = {};
      const keysToDelete = Object.values(state.matches).filter(
        (match) => match.groupId !== groupId
      );
      for (const key of keysToDelete) {
        prev[key.match.id!] = key;
      }

      return { ...state, matches: prev };
    }
  ),
  on(
    CreatedMatchEvent,
    (state, { fixtureStageId, groupId, tournamentId, match }) => {
      const prev = { ...state.matches };
      prev[match.id!] = { match, fixtureStageId, groupId, tournamentId };
      return { ...state, matches: prev };
    }
  ),
  on(
    UpdatedMatchEvent,
    (state, { fixtureStageId, groupId, tournamentId, match }) => {
      const prev: any = {};
      for (const t of Object.keys(state.matches)) {
        if (t != match.id) {
          prev[t] = state.matches[t];
        } else {
          prev[t] = { match, fixtureStageId, groupId, tournamentId };
        }
      }
      return { ...state, matches: prev };
    }
  )
);
