import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  NodeMatchEntity
} from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import {
  GetMainDrawByTournamentCommand
} from './main-draw.commands';
import {
  ConsultedNodeMatchesEvent
} from './main-draw.events';

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
  // CreateNodeMatchCommand$: any = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CreateNodeMatchCommand.type),
  //     mergeMap((action: any) => {
  //       return this.tournamentAdapter.createNodeMatch(action.fixtureStage).pipe(
  //         mergeMap((response: IBaseResponse<NodeMatchEntity>) => {
  //           const res: any[] = [
  //             TransactionResolvedEvent({
  //               meta: response.meta,
  //               transactionId: action.transactionId,
  //             }),
  //           ];

  //           const status = isASuccessResponse(response);
  //           if (status) {
  //             res.push(
  //               ConsultedNodeMatchesEvent({
  //                 nodeMatches: [response.data],
  //                 tournamentId: action.fixtureStage.tournamentId,
  //               })
  //             );
  //           }
  //           return res;
  //         }),
  //         catchError(() => EMPTY)
  //       );
  //     })
  //   )
  // );

  // DeleteNodeMatchCommand$: any = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DeleteNodeMatchCommand.type),
  //     mergeMap((action: any) => {
  //       return this.tournamentAdapter
  //         .deleteNodeMatch(action.tournamentId, action.fixtureStageId)
  //         .pipe(
  //           mergeMap((response: IBaseResponse<Id>) => {
  //             const res: any[] = [
  //               TransactionResolvedEvent({
  //                 meta: response.meta,
  //                 transactionId: action.transactionId,
  //               }),
  //             ];

  //             const status = isASuccessResponse(response);
  //             if (status) {
  //               res.push(
  //                 DeletedNodeMatchesEvent({
  //                   fixtureStageId: response.data,
  //                 })
  //               );
  //             }
  //             return res;
  //           }),
  //           catchError(() => EMPTY)
  //         );
  //     })
  //   )
  // );
}
