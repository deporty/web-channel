import { Injectable } from '@angular/core';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, zip } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { LocationAdapter } from '../../adapters/location.adapter';
import {
  GetLocationByIdCommand,
  GetLocationsByIdsCommand,
  GetLocationsByRatioCommand,
} from './locations.commands';
import {
  ConsultedLocationsByRatioEvent,
  ConsultedLocationsEvent,
} from './locations.events';
import { selectLocationById } from './locations.selector';

@Injectable()
export class LocationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private tournamentAdapter: LocationAdapter
  ) {}

  GetLocationsByIdsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetLocationsByIdsCommand.type),

      mergeMap((action: any) => {
        return zip(
          ...action.ids.map((x: Id) =>
            this.store.select(selectLocationById(x)).pipe(
              map((data) => {
                return {
                  id: x,
                  data,
                };
              })
            )
          )
        ).pipe(
          map((arra) => {
            const filtered = arra
              .filter((item: any) => {
                return !item.data;
              })
              .map((y: any) => {
                return y.id;
              });

            return {
              ...action,
              ids: filtered,
            };
          })
        );
      }),
      filter((action: any) => action.ids.length > 0),

      mergeMap((action: any) => {
        return this.tournamentAdapter.getLocationsByIds(action.ids).pipe(
          map((response: IBaseResponse<LocationEntity[]>) => {
            return ConsultedLocationsEvent({
              locations: response.data || [],
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetLocationByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetLocationByIdCommand.type),

      mergeMap((action: any) => {
        return this.store.select(selectLocationById(action.locationId)).pipe(
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
        return this.tournamentAdapter
          .getLocationsByIds([data.action.locationId])
          .pipe(
            map((response: IBaseResponse<LocationEntity[]>) => {
              return ConsultedLocationsEvent({
                locations: response.data || [],
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetLocationsByRatioCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetLocationsByRatioCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getLocationsByRatio(action.origin, action.ratio)
          .pipe(
            map((response: IBaseResponse<LocationEntity[]>) => {
              return ConsultedLocationsByRatioEvent({
                locations: response.data || [],
                ratio: action.ratio,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
}
