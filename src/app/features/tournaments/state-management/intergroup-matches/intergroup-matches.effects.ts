import { Injectable } from '@angular/core';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { IntergroupMatchEntity } from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { IntegroupMatchAdapter } from '../../adapters/intergroup-match.adapter';
import {
  ConsultedIntergroupMatchesEvent,
  CreateIntergroupMatchCommand,
  DeleteIntergroupMatchCommand,
  DeletedIntergroupMatchEvent,
  EditIntergroupMatchCommand,
  GetIntergroupMatchesCommand,
  TransactionResolvedEvent,
} from './intergroup-matches.actions';
import { GetPositionTablesCommand } from '../groups/groups.actions';

@Injectable()
export class IntergroupMatchesEffects {
  constructor(
    private actions$: Actions,
    private integroupMatchAdapter: IntegroupMatchAdapter
  ) {}

  GetIntergroupMatchesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetIntergroupMatchesCommand.type),
      mergeMap((action: any) => {
        return this.integroupMatchAdapter
          .getIntergroupMatches(
            action.tournamentId,
            action.fixtureStageId,
            action.states
          )
          .pipe(
            map((response: IBaseResponse<Array<IntergroupMatchEntity>>) => {
              return ConsultedIntergroupMatchesEvent({
                fixtureStageId: action.fixtureStageId,
                intergroupMatches: response.data,
                tournamentId: action.tournamentId,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  CreateIntergroupMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateIntergroupMatchCommand.type),
      mergeMap((action: any) => {
        return this.integroupMatchAdapter
          .addIntergroupMatch(
            action.tournamentId,
            action.fixtureStageId,
            action.teamAId,
            action.teamBId
          )
          .pipe(
            mergeMap((response: IBaseResponse<IntergroupMatchEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);

              if (status) {
                res.push(
                  ConsultedIntergroupMatchesEvent({
                    intergroupMatches: [response.data],
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                  })
                );
              }
              return res;
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  EditIntergroupMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(EditIntergroupMatchCommand.type),
      mergeMap((action: any) => {
        return this.integroupMatchAdapter
          .editIntergroupMatch(
            action.tournamentId,
            action.fixtureStageId,
            action.intergroupMatch
          )
          .pipe(
            mergeMap((response: IBaseResponse<any>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  ConsultedIntergroupMatchesEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    intergroupMatches: [response.data],
                  })
                );
              }
              return res;
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  DeleteIntergroupMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteIntergroupMatchCommand.type),
      mergeMap((action: any) => {
        return this.integroupMatchAdapter
          .deleteIntergroupMatch(
            action.tournamentId,
            action.fixtureStageId,
            action.intergroupMatchId
          )
          .pipe(
            mergeMap((response: IBaseResponse<Id>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  DeletedIntergroupMatchEvent({
                    fixtureStageId: response.data,
                    tournamentId: action.tournamentId,
                    intergroupMatchId: action.intergroupMatchId,
                  })
                );
              }
              return res;
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
}
