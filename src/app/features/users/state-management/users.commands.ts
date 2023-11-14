import { Id } from '@deporty-org/entities/general';
import { ROL } from '@deporty-org/entities/authorization';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { createAction, props } from '@ngrx/store';

export const GetUserByIdCommand = createAction(
  '[***] GetUserByIdCommand',
  props<{ id: Id, transactionId:string }>()
);
export const GetUsersByIdsCommand = createAction(
  '[***] GetUsersByIdsCommand',
  props<{ ids: Id[] }>()
);

export const GetUsersByRolCommand = createAction(
  '[***] GetUsersByRolCommand',
  props<{ pageNumber: number; pageSize: number; rol: ROL }>()
);
export const GetUsersByFiltersCommand = createAction(
  '[***] GetUsersByFiltersCommand',
  props<{
    firstName: string;
    firstLastName: string;
    secondName: string;
    secondLastName: string;
    roles: Id[];
  }>()
);
