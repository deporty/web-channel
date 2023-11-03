import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  GroupEntity,
  MatchEntity,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import {
  AddMatchToGroupCommand,
  ConsultedMatchsEvent,
  CreatedMatchEvent,
  EditGroupMatchCommand,
  GetMatchsByGroupIdCommand,
  TransactionResolvedEvent,
  UpdatedMatchEvent,
} from './matches.actions';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { UpdatePositionTablesEvent } from '../groups/groups.actions';
import { GetCardsReportCommand } from 'src/app/features/organizations/organizations.commands';
import { GetGroupedMatchesByTournamentByIdCommand, GetMarkersTableCommand } from '../tournaments/tournaments.actions';

@Injectable()
export class MatchEffects {
  constructor(
    private actions$: Actions,
    private tournamentAdapter: TournamentAdapter
  ) {}

  GetMatchsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMatchsByGroupIdCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getMatchesByGroup(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId,
            action.states
          )
          .pipe(
            map((response: IBaseResponse<MatchEntity[]>) => {
              return ConsultedMatchsEvent({
                tournamentId: action.tournamentId,
                fixtureStageId: action.fixtureStageId,
                groupId: action.groupId,
                matches: response.data || [],
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  AddMatchToGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(AddMatchToGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .addMatchToGroupInsideTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId,
            action.teamAId,
            action.teamBId
          )
          .pipe(
            mergeMap((response: IBaseResponse<MatchEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  CreatedMatchEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
                    match: response.data,
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
  EditGroupMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(EditGroupMatchCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .editMatchOfGroupInsideTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId,
            action.match
          )
          .pipe(
            mergeMap(
              (
                response: IBaseResponse<{
                  match: MatchEntity;
                  positionsTable: PositionsTable;
                }>
              ) => {
                const res: any[] = [
                  TransactionResolvedEvent({
                    meta: response.meta,
                    transactionId: action.transactionId,
                  }),
                ];

                const status = isASuccessResponse(response);
                if (status) {
                  res.push(
                    UpdatedMatchEvent({
                      tournamentId: action.tournamentId,
                      fixtureStageId: action.fixtureStageId,
                      groupId: action.groupId,
                      match: response.data.match,
                    }),

                    UpdatePositionTablesEvent({
                      table: response.data.positionsTable,
                      groupId: action.groupId,
                    }),

                    GetCardsReportCommand({
                      tournamentId: action.tournamentId,
                    }),

                    GetMarkersTableCommand({
                      tournamentId: action.tournamentId,
                    }),
                    GetGroupedMatchesByTournamentByIdCommand({
                      tournamentId: action.tournamentId,
                    }),

                  );
                }
                return res;
              }
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
}
