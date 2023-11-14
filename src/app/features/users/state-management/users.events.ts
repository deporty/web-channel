import { UserEntity } from '@deporty-org/entities/users';
import { createAction, props } from '@ngrx/store';


export const TransactionResolvedEvent = createAction(
  '[UsersEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);
export const TransactionDeletedEvent = createAction(
  '[UsersEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);
export const ConsultedUserEvent = createAction(
  '[***] ConsultedUserEvent',
  props<{ user: UserEntity }>()
);

export const ConsultedUsersEvent = createAction(
  '[***] ConsultedUsersEvent',
  props<{ users: UserEntity[] }>()
);


