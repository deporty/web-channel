import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { SportAdapter } from '../adapters/sport.adapter';
import { TeamAdapter } from '../adapters/team.adapter';
import {
  GetMemberByIdCommand,
  GetSportByIdCommand,
  GetTeamByIdCommand,
  GetTeamsByFiltersCommand,
  GetTeamsCommand,
  GetTeamsMembersCommand,
} from './teams.commands';
import {
  ConsultedFilteredTeamsEvent,
  ConsultedMemberEvent,
  ConsultedSportByIdEvent,
  ConsultedTeamByIdEvent,
  ConsultedTeamMembersEvent,
  ConsultedTeamsEvent,
} from './teams.events';
import {
  selectMemberById,
  selectSportById,
  selectTeamById,
} from './teams.selectors';
import { MemberAdapter } from '../adapters/member.adapter';

@Injectable()
export class TeamsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private teamsAdapter: TeamAdapter,
    private sportAdapter: SportAdapter,
    private memberAdapter: MemberAdapter
  ) {}

  GetTeamsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTeamsCommand.type),
      mergeMap((action: any) => {
        return this.teamsAdapter
          .getTeams(action.pageSize, action.pageNumber)
          .pipe(
            map((response) =>
              ConsultedTeamsEvent({
                pageSize: action.pageSize,
                pageNumber: action.pageNumber,
                teams: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetTeamsByFiltersCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTeamsByFiltersCommand.type),
      mergeMap((action: any) => {
        return this.teamsAdapter.getTeamsByFilters(action.filters).pipe(
          map((response) =>
            ConsultedFilteredTeamsEvent({
              teams: response.data,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetTeamsMembersCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTeamsMembersCommand.type),
      mergeMap((action: any) => {
        return this.teamsAdapter.getMembersByTeam(action.teamId).pipe(
          map((response) =>
            ConsultedTeamMembersEvent({
              members: response.data,
              teamId: action.teamId,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetTeamByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTeamByIdCommand.type),
      mergeMap((action: any) => {
        return this.store.select(selectTeamById(action.teamId)).pipe(
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
        return this.teamsAdapter.getTeamById(data.action.teamId).pipe(
          map((response) => {
            return ConsultedTeamByIdEvent({
              team: response.data,
            });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetSportByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetSportByIdCommand.type),
      mergeMap((action: any) => {
        return this.store.select(selectSportById(action.sportId)).pipe(
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
        return this.sportAdapter.getSportById(data.action.sportId).pipe(
          map((response) =>
            ConsultedSportByIdEvent({
              sport: response.data,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetMemberByIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMemberByIdCommand.type),
      mergeMap((action: any) => {
        return this.store
          .select(selectMemberById(action.teamId, action.memberId))
          .pipe(
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
        return this.memberAdapter
          .getMemberById(data.action.teamId, data.action.memberId)
          .pipe(
            map((response) =>
              ConsultedMemberEvent({
                member: response.data,
                teamId: data.action.teamId,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
}
