import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdministrationContract } from '../infrastructure/administration.contract';
import { GetResourcesCommand } from './administration.commands';
import { ResourcesContract } from '../infrastructure/resources.contract';
import { ConsultedResourcesEvent } from './administration.events';

@Injectable()
export class AdministrationEffects {
  constructor(
    private actions$: Actions,
    private resourcesContract: ResourcesContract
  ) {}

  GetResourcesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetResourcesCommand.type),
      mergeMap((action: any) => {
        console.log('emprender');
        
        return this.resourcesContract.gerResources().pipe(
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
