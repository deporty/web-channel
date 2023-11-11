import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdministrationContract } from '../infrastructure/administration.contract';
import { TournamentCostGotten } from './administration.events';

@Injectable()
export class InvoicesEffects {
  constructor(
    private actions$: Actions,
    private AdministrationContract: AdministrationContract
  ) {}


}
