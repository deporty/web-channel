import { Injectable } from '@angular/core';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  FixtureStageEntity
} from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import { DeleteGroupsByFixtureIdCommand } from '../groups/groups.actions';
import {
  ConsultedFixtureStagesEvent,
  CreateFixtureStageCommand,
  DeleteFixtureStageCommand,
  DeletedFixtureStagesEvent,
  GetFixtureStagesCommand,
  TransactionResolvedEvent,
} from './fixture-stages.actions';

@Injectable()
export class FixtureStagesEffects {
  constructor(
    private actions$: Actions,
    private tournamentAdapter: TournamentAdapter
  ) {}

  GetFixtureStagesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetFixtureStagesCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getFixtureStagesByTournament(action.tournamentId)
          .pipe(
            map((response: IBaseResponse<Array<FixtureStageEntity>>) => {
              return ConsultedFixtureStagesEvent({
                fixtureStages: response.data,
                tournamentId: action.tournamentId,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  CreateFixtureStageCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateFixtureStageCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .createFixtureStage(action.fixtureStage)
          .pipe(
            mergeMap((response: IBaseResponse<FixtureStageEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  ConsultedFixtureStagesEvent({
                    fixtureStages: [response.data],
                    tournamentId: action.fixtureStage.tournamentId,
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

  DeleteFixtureStageCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteFixtureStageCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .deleteFixtureStage(action.tournamentId, action.fixtureStageId)
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
                  DeletedFixtureStagesEvent({
                    fixtureStageId: response.data,
                  }),
                  DeleteGroupsByFixtureIdCommand({
                    fixtureStageId: response.data,
                    tournamentId: action.tournamentId,
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
