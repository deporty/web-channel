import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';

import {
  GetUserByIdCommand,
  GetUsersByFiltersCommand,
  GetUsersByRolCommand,
} from './users.commands';
import { ConsultedUserEvent, ConsultedUsersEvent } from './users.events';
import { UserAdapter } from '../infrastructure/user.adapter';
import { IBaseResponse, UserEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { selectUserById } from './users.selector';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private userService: UserAdapter,
    private store: Store
  ) {}

  GetUserByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUserByIdCommand.type),

      mergeMap((action: any) => {
        return this.store.select(selectUserById(action.id)).pipe(
          map((searchedValue) => {
            return {
              action,
              searchedValue,
            };
          })
        );
      }),
      filter((data: any) => !data.searchedValue),

      mergeMap((data: any) => {
        return this.userService.getUserById(data.action.id).pipe(
          map((movies: IBaseResponse<UserEntity>) => {
            return ConsultedUserEvent({
              user: movies.data,
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  GetUsersByRolCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUsersByRolCommand.type),
      mergeMap((action: any) => {
        return this.userService
          .getUsersByRol(action.rol, action.pageNumber, action.pageSize)
          .pipe(
            map((movies) =>
              ConsultedUsersEvent({
                users: movies.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetUsersByFiltersCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUsersByFiltersCommand.type),
      mergeMap((action: any) => {
        return this.userService
          .getUsersByFilters(
            action.roles,
            action.firstName,
            action.firstLastName,
            action.secondName,
            action.secondLastName
          )
          .pipe(
            map((movies) =>
              ConsultedUsersEvent({
                users: movies.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
}
