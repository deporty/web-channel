import { Id, PermissionEntity, ResourceEntity, RoleEntity, TournamentEntity } from '@deporty-org/entities';
import { createAction, props } from '@ngrx/store';

export const TransactionDeletedEvent = createAction(
  '[GroupsEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);

export const TransactionResolvedEvent = createAction(
  '[GroupsEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);
export const ConsultedRolesEvent = createAction(
  'ConsultedRolesEvent',
  props<{
    roles: RoleEntity[];
  }>()
);
export const ConsultedPermissionsEvent = createAction(
  'ConsultedPermissionsEvent',
  props<{
    permissions: PermissionEntity[];
  }>()
);
export const ConsultedResourcesEvent = createAction(
  'ConsultedResourcesEvent',
  props<{
    resources: ResourceEntity[];
  }>()
);
