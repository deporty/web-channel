import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { UserAdapter } from 'src/app/features/users/infrastructure/user.adapter';
import { OrganizationAdapter } from '../../../organizations/service/organization.adapter';
import { TournamentAdapter } from '../../adapters/tournament.adapter';
import {
  ConsultedGroupedMatchesByTournamentEvent,
  ConsultedLessDefeatedFenceEvent,
  ConsultedMainDrawByTournamentEvent,
  ConsultedMarkersTableEvent,
  ConsultedRegisteredTeamsEvent,
  ConsultedTournamentEvent,
  DeleteRegisteredTeamsCommand,
  DeletedRegisteredTeamEvent,
  GenerateMainDrawCommand,
  GetAvailableTeamsToAddCommand,
  GetCurrentTournamentsCommand,
  GetGroupedMatchesByTournamentByIdCommand,
  GetIntergroupMatchCommand,
  GetLessDefeatedFenceByTournametIdCommand,
  GetMarkersTableCommand,
  GetMatchByTeamsInStageGroupCommand,
  GetMatchHistoryCommand,
  GetRegisteredTeamsCommand,
  GetTournamentByIdCommand,
  GetTournamentByPositionCommand,
  GetTournamentsByOrganizationAndTournamentLayoutCommand,
  ModifiedRegisteredTeamStatusEvent,
  ModifiedTournamentLocationsEvent,
  ModifiedTournamentRefereesEvent,
  ModifiedTournamentStatusEvent,
  ModifyRegisteredTeamStatusCommand,
  ModifyTournamentLocationsCommand,
  ModifyTournamentRefereesCommand,
  ModifyTournamentStatusCommand,
  RegisterTeamsCommand,
  TransactionResolvedEvent,
  UpdateAvailableTeamsToAddEvent,
  UpdateCurrentMatchByTeamsInStageGroupEvent,
  UpdateIntergroupMatchEvent,
  UpdateIntergroupMatchesEvent,
  UpdateMatchHistoryEvent,
  UpdateNewRegisteredTeamsEvent,
  UpdatedCurrentIntergroupMatchEvent,
  UpdatedTournamentsOverviewEvent,
} from './tournaments.actions';
import { ConsultedNodeMatchesEvent } from '../main-draw/main-draw.events';
import { GetTeamsByIdsCommand } from 'src/app/features/teams/state-management/teams.commands';

@Injectable()
export class TournamentsEffects {
  DeleteRegisteredTeamsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteRegisteredTeamsCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .deleteRegisteredTeam(action.tournamentId, action.registeredTeamId)
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
                  DeletedRegisteredTeamEvent({
                    tournamentId: action.tournamentId,
                    registeredTeamId: response.data,
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
  GetAllSummaryTournamentsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTournamentsByOrganizationAndTournamentLayoutCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getTournamentsByOrganizationAndTournamentLayout(
            action.organizationId,
            action.tournamentLayoutId,
            action.includeDraft
          )
          .pipe(
            map((response) =>
              UpdatedTournamentsOverviewEvent({
                tournaments: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetCurrentTournamentsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetCurrentTournamentsCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.getCurrentTournamentsCommand().pipe(
          map((response) =>
            UpdatedTournamentsOverviewEvent({
              tournaments: response.data,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetGroupedMatchesByTournamentByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetGroupedMatchesByTournamentByIdCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getGroupedMatchesByTournamentById(action.tournamentId)
          .pipe(
            map((response) =>
              ConsultedGroupedMatchesByTournamentEvent({
                matches: response.data,
                tournamentId: action.tournamentId,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetLessDefeatedFenceByTournametIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetLessDefeatedFenceByTournametIdCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getLessDefeatedFenceByTournametIdCommand(action.tournamentId)
          .pipe(
            map((response) =>
              ConsultedLessDefeatedFenceEvent({
                report: response.data,
                tournamentId: action.tournamentId,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetTournamentByPositionCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTournamentByPositionCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getTournamentsByOrganizationAndTournamentLayout(
            'Wsib20rGNlTR2UsU42eY',
            '155b473c8db7486f995d',
            true
          )
          .pipe(
            map((response) =>
              UpdatedTournamentsOverviewEvent({
                tournaments: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  ModifyRegisteredTeamStatusCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ModifyRegisteredTeamStatusCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .modifyRegisteredTeamStatus(
            action.tournamentId,
            action.registeredTeamId,
            action.status
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
                  ModifiedRegisteredTeamStatusEvent({
                    tournamentId: action.tournamentId,
                    registeredTeam: response.data,
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
  GenerateMainDrawCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GenerateMainDrawCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .generateMainDraw(action.tournamentId)
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
                  ConsultedNodeMatchesEvent({
                    nodeMatches: response.data,
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
  ModifyTournamentLocationsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ModifyTournamentLocationsCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .modifyTournamentLocations(action.tournamentId, action.locations)
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
                  ModifiedTournamentLocationsEvent({
                    tournament: response.data,
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
  ModifyTournamentRefereesCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ModifyTournamentRefereesCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .modifyTournamentReferees(action.tournamentId, action.refereeIds)
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
                  ModifiedTournamentRefereesEvent({
                    tournament: response.data,
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
  ModifyTournamentStatusCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ModifyTournamentStatusCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .modifyTournamentStatus(action.tournamentId, action.status)
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
                  ModifiedTournamentStatusEvent({
                    tournament: response.data,
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
  RegisterTeamsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterTeamsCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .addTeamsToTournament(
            action.tournamentId,
            action.teams.map((x: TeamEntity) => x.id)
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
                  UpdateNewRegisteredTeamsEvent({
                    registeredTeams: response.data,
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
  GetIntergroupMatchCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetIntergroupMatchCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getIntergroupMatch(
            action.tournamentId,
            action.stageId,
            action.intergroupMatchId
          )
          .pipe(
            map((response: IBaseResponse<any>) => {
              return UpdateIntergroupMatchEvent({
                intergroupMatch: response.data,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );

  GetMatchByTeamsInStageGroupCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMatchByTeamsInStageGroupCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getMatchInsideGroup(
            action.tournamentId,
            action.stageId,
            action.groupLabel,
            action.teamAId,
            action.teamBId
          )
          .pipe(
            map((response: IBaseResponse<any>) => {
              return UpdateCurrentMatchByTeamsInStageGroupEvent({
                match: response.data,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetMatchHistoryCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMatchHistoryCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getGroupedMatches(action.tournamentId, action.stageId)
          .pipe(
            map((response: IBaseResponse<any>) => {
              return UpdateMatchHistoryEvent({
                response: response.data,
                stageId: action.stageId,
                stageOrder: action.stageOrder,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetAvailableTeamsToAddCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetAvailableTeamsToAddCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getAvailableTeamsToAdd(
            action.tournamentId,
            action.member,
            action.name,
            action.category
          )
          .pipe(
            map((response) =>
              UpdateAvailableTeamsToAddEvent({
                teams: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetMarkersTableCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMarkersTableCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getMarkersTableByTornament(action.tournamentId)
          .pipe(
            map((response) =>
              ConsultedMarkersTableEvent({
                table: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetRegisteredTeamsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetRegisteredTeamsCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getRegisteredTeams(action.tournamentId)
          .pipe(
            mergeMap((response) => {
              const teamIds = response.data.map((x) => x.teamId);
              const res: any[] = [
                ConsultedRegisteredTeamsEvent({
                  registeredTeams: response.data,
                }),

                GetTeamsByIdsCommand({
                  teamIds,
                }),
              ];

              return res;
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetTournamentByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTournamentByIdCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter
          .getTournamentSummaryById(action.tournamentId)
          .pipe(
            map((response) =>
              ConsultedTournamentEvent({
                tournament: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private tournamentAdapter: TournamentAdapter,
    private userAdapater: UserAdapter,
    private organizationAdapter: OrganizationAdapter
  ) {}
}
