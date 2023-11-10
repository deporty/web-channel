import { Injectable } from '@angular/core';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import {
  CreateNodeMatchCommand,
  DeleteNodeMatchCommand,
  EditNodeMatchCommand,
  GetMainDrawByTournamentCommand,
} from './main-draw.commands';
import {
  ConsultedNodeMatchesEvent,
  DeletedNodeMatchesEvent,
  TransactionResolvedEvent,
} from './main-draw.events';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { GetCardsReportCommand } from 'src/app/features/organizations/organizations.commands';
import { GetGroupedMatchesByTournamentByIdCommand, GetMarkersTableCommand } from '../tournaments/tournaments.actions';

@Injectable()
export class MainDrawEffects {
  constructor(
    private actions$: Actions,
    private tournamentAdapter: TournamentAdapter
  ) {}

  GetNodeMatchesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMainDrawByTournamentCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getMainDrawByTournament(action.tournamentId)
          .pipe(
            map((response: IBaseResponse<Array<NodeMatchEntity>>) => {
              return ConsultedNodeMatchesEvent({
                nodeMatches: response.data,
                tournamentId: action.tournamentId,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  EditNodeMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(EditNodeMatchCommand.type),
      mergeMap((action: any) => {
        console.log(action);

        return this.tournamentAdapter
          .editNodeMatch(action.nodeMatch.tournamentId, action.nodeMatch)
          .pipe(
            mergeMap((response: IBaseResponse<NodeMatchEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  ConsultedNodeMatchesEvent({
                    tournamentId: action.nodeMatch.tournamentId,
                    nodeMatches: [response.data],
                  })
                );

                res.push(
                  GetCardsReportCommand({
                    tournamentId: action.nodeMatch.tournamentId,
                  }),
                  GetMarkersTableCommand({
                    tournamentId: action.nodeMatch.tournamentId,
                  }),
                  GetGroupedMatchesByTournamentByIdCommand({
                    tournamentId: action.nodeMatch.tournamentId,
                  }),
                );
              }
              return res;
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  CreateNodeMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateNodeMatchCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.createNodeMatch(action.nodeMatch).pipe(
          mergeMap((response: IBaseResponse<NodeMatchEntity>) => {
            const res: any[] = [
              TransactionResolvedEvent({
                meta: response.meta,
                transactionId: action.transactionId,
              }),
            ];

            const status = isASuccessResponse(response);
            if (status) {
              res.push(
                ConsultedNodeMatchesEvent({
                  nodeMatches: [response.data],
                  tournamentId: action.nodeMatch.tournamentId,
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

  DeleteNodeMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteNodeMatchCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .deleteNodeMatch(action.tournamentId, action.nodeMatchId)
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
                  DeletedNodeMatchesEvent({
                    nodeMatchId: response.data,
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
