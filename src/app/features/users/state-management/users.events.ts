import { UserEntity } from '@deporty-org/entities/users';
import { createAction, props } from '@ngrx/store';

export const ConsultedUserEvent = createAction(
  '[***] ConsultedUserEvent',
  props<{ user: UserEntity }>()
);

export const ConsultedUsersEvent = createAction(
  '[***] ConsultedUsersEvent',
  props<{ users: UserEntity[] }>()
);


