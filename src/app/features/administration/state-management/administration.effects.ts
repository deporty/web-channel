import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdministrationContract } from '../infrastructure/administration.contract';
import {
  GetPermissionsCommand,
  GetResourcesCommand,
  GetRolesCommand,
} from './administration.commands';
import { ResourcesContract } from '../infrastructure/resources.contract';
import {
  ConsultedPermissionsEvent,
  ConsultedResourcesEvent,
  ConsultedRolesEvent,
} from './administration.events';
import { RolesContract } from '../infrastructure/roles.contract';
import { PermissionsContract } from '../infrastructure/permissions.contract';

@Injectable()
export class AdministrationEffects {
  constructor(
    private actions$: Actions,
    private rolesContract: RolesContract,
    private permissionsContract: PermissionsContract,
    private resourcesContract: ResourcesContract
  ) {}

  GetRolesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetRolesCommand.type),
      mergeMap((action: any) => {
        return this.rolesContract.getRoles().pipe(
          map((response) => {
            return ConsultedRolesEvent({
              roles: response.data,
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  GetPermissionsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetPermissionsCommand.type),
      mergeMap((action: any) => {
        return this.permissionsContract.getPermissions().pipe(
          map((response) => {
            return ConsultedPermissionsEvent({
              permissions: response.data,
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  GetResourcesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetResourcesCommand.type),
      mergeMap((action: any) => {
        return this.resourcesContract.getResources().pipe(
          map((response) => {
            return ConsultedResourcesEvent({
              resources: response.data,
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );
}
