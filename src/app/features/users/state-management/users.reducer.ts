import { createReducer, on } from '@ngrx/store';
import { ConsultedUserEvent, ConsultedUsersEvent, TransactionDeletedEvent, TransactionResolvedEvent } from './users.events';
import { UserState } from './users.states';

export const usersKey = 'users';
export const initialState: UserState = {
  users: {},
  transactions: {}
};

export const UserReducer = createReducer<UserState, any>(
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
  on(ConsultedUserEvent, (state, { user }) => { 
    const users = { ...state.users };
    if (user.id) users[user.id] = user;
    return { ...state, users };
  }),
  on(ConsultedUsersEvent, (state, { users }) => {
    const usersTemp = { ...state.users };
    for (const t of users) {
      usersTemp[t.id!] = t;
    }
    return { ...state, users: usersTemp };
  })
);
