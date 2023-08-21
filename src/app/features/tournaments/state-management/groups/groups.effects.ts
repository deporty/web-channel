import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  GroupEntity,
  MatchEntity
} from '@deporty-org/entities/tournaments';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import {
  ConsultedMatchsEvent,
  DeleteMatchesByGroupIdCommand,
  GetMatchsByGroupIdCommand,
} from '../matches/matches.actions';
import {
  AddTeamToGroupCommand,
  ConsultedGroupsEvent,
  CreateGroupCommand,
  CreateGroupEvent as CreatedGroupEvent,
  DeleteGroupCommand,
  DeleteTeamsInGroupCommand,
  DeletedGroupEvent,
  DeletedTeamsInGroupEvent,
  GetGroupDefinitionCommand,
  GetGroupsByFixtureStageCommand,
  PublishAllMatchesInGroupCommand,
  TransactionResolvedEvent,
  UpdateGroupSpecificationEvent
} from './groups.actions';
import { selectGroupByLabel } from './groups.selector';

@Injectable()
export class GroupEffects {
  AddTeamToGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(AddTeamToGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .addTeamsToGroupTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId,
            action.teams
          )
          .pipe(
            mergeMap((response) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  UpdateGroupSpecificationEvent({
                    group: response.data,
                    tournamentId: action.tournamentId,
                  })
                );

                res.push(
                  GetMatchsByGroupIdCommand({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
                    states: ['completed', 'editing', 'published'],
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
  CreateGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .createGroupInsideTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupLabel,
            action.groupOrder
          )
          .pipe(
            mergeMap((response: IBaseResponse<GroupEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  CreatedGroupEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    group: response.data,
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
  PublishAllMatchesInGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(PublishAllMatchesInGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .publishAllMatchesInGroupCommand(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId
          )
          .pipe(
            mergeMap((response: IBaseResponse<MatchEntity[]>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  ConsultedMatchsEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
                    matches: response.data,
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
  DeleteGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .deleteGroupInsideTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId
          )
          .pipe(
            mergeMap((response) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  DeletedGroupEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
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
  DeleteTeamsInGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteTeamsInGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .deleteTeamsInGroupInsideTournament(
            action.tournamentId,
            action.fixtureStageId,
            action.groupId,
            action.teamIds
          )
          .pipe(
            mergeMap((response) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);
              if (status) {
                res.push(
                  DeletedTeamsInGroupEvent({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    group: response.data,
                  })
                );

                res.push(
                  DeleteMatchesByGroupIdCommand({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
                  })
                );
                res.push(
                  GetMatchsByGroupIdCommand({
                    tournamentId: action.tournamentId,
                    fixtureStageId: action.fixtureStageId,
                    groupId: action.groupId,
                    states: ['completed', 'editing', 'published'],
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
  GetGroupDefinitionCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetGroupDefinitionCommand.type),

      mergeMap((action: any) => {
        return this.store.select(selectGroupByLabel(action.groupLabel)).pipe(
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
        const action = data.action;
        return this.tournamentAdapter
          .getGroupSpecificationInsideTournament(
            action.tournamentId,
            action.stageId,
            action.groupLabel
          )
          .pipe(
            map((response) =>
              UpdateGroupSpecificationEvent({
                group: response.data,
                tournamentId: action.tournamentId,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetGroupsByFixtureStageCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetGroupsByFixtureStageCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getGroupsByFixtureStage(action.tournamentId, action.fixtureStageId)
          .pipe(
            map((response: IBaseResponse<GroupEntity[]>) => {
              return ConsultedGroupsEvent({
                tournamentId: action.tournamentId,
                fixtureStageId: action.fixtureStageId,
                groups: response.data,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  // GetPositionTablesCommand$: any = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GetPositionTablesCommand.type),
  //     mergeMap((action: any) => {
  //       // tournamentId: Id;
  //       // fixtureStageId: Id;
  //       // groupId: Id;
  //       return this.tournamentAdapter
  //         .getPositionTables(
  //           action.tournamentId,
  //           action.fixtureStageId,
  //           action.groupId
  //         )
  //         .pipe(
  //           map((response: IBaseResponse<PointsStadistics[]>) => {
  //             return UpdatePositionTablesEvent({
  //               table: response.data,
  //               groupId: action.groupId,
  //             });
  //           }),
  //           catchError(() => EMPTY)
  //         );
  //     })
  //   )
  // );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private tournamentAdapter: TournamentAdapter
  ) {}
}
