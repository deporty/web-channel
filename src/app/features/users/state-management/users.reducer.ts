import { createReducer, on } from '@ngrx/store';
import { ConsultedUserEvent, ConsultedUsersEvent } from './users.events';
import { UserState } from './users.states';

export const usersKey = 'users';
export const initialState: UserState = {
  users: {},
};

export const UserReducer = createReducer<UserState, any>(
  initialState,

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
