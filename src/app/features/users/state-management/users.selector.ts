import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { usersKey } from './users.reducer';
import { UserState } from './users.states';
import { UserEntity } from '@deporty-org/entities/users';
import { ROL } from '@deporty-org/entities/authorization';

export const selectUsers = createFeatureSelector<UserState>(usersKey);


export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectUsers,
    (state: UserState) => state.transactions[transactionId]
  );

export const selectUserById = (id: string) =>
  createSelector(selectUsers, (state: UserState) => state.users[id]);

export const selectUsersById = (ids: Array<string>) =>
  createSelector(selectUsers, (state: UserState) => {
    const response: Array<UserEntity> = [];
    for (const id of ids) {
      const t = state.users[id];
      response.push(t);
    }

    return response;
  });
export const selectUsersByRol = (rol: ROL) =>
  createSelector(selectUsers, (state: UserState) => {
    const t = Object.values(state.users);
    // .filter((x) => x.roles.indexOf(rol));
    return t;
  });

export const selectUsersByFilters = (
  roles: string[],
  firstName: string,
  firstLastName: string,
  secondName: string,
  secondLastName: string
) =>
  createSelector(selectUsers, (state: UserState) => {
    const t = Object.values(state.users).filter((user) => {
      let exist = false;
      let i = 0;
      while (!exist && i < roles.length) {
        exist = user.roles.includes(roles[i]);
        i++;
      }

      const firstNameFlag = user.firstName
        .toUpperCase()
        .includes(firstName.toUpperCase());
      const firstLastNameFlag = user.firstLastName
        .toUpperCase()
        .includes(firstLastName.toUpperCase());

      const secondNameFlag = user.secondName
        .toUpperCase()
        .includes(secondName.toUpperCase());
      const secondLastNameFlag = user.secondLastName
        .toUpperCase()
        .includes(secondLastName.toUpperCase());

      return (
        exist &&
        firstNameFlag &&
        firstLastNameFlag &&
        secondNameFlag &&
        secondLastNameFlag
      );
    });
    return t;
  });
