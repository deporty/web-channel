import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import {
  CreatedTournamentEvent,
  DeletedTournamentEvent,
  TransactionResolvedEvent,
  UpdateOrganizationsInfoEvent,
  UpdatedTournamentLayoutsEvent,
  UpdatedTournamentsEvent,
  UpdatedOrganizationEvent,
  ConsultedOrganizationsEvent,
} from './organizations.events';
import {
  CreateTournamentCommand,
  CreateTournamentLayoutCommand,
  DeleteTournamentByIdCommand,
  EditTournamentLayoutCommand,
  GetMyOrganizationsCommand,
  GetOrganizationByIdCommand,
  GetOrganizationsCommand,
  GetTournamentLayoutByIdCommand,
  GetTournamentLayoutsByOrganizationIdCommand,
  GetTournamentsByOrganizationAndTournamentLayoutCommand,
} from './organizations.commands';
import { TournamentAdapter } from '../tournaments/adapters/tournament.adapter';
import { OrganizationAdapter } from './service/organization.adapter';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';

@Injectable()
export class OrganizationsEffects {
  constructor(
    private actions$: Actions,
    private organizationAdapter: OrganizationAdapter,
    private tournamentAdapter: TournamentAdapter
  ) {}

  GetMyOrganizationsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMyOrganizationsCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .getOrganizationsByMemberEmail(action.email)
          .pipe(
            map((movies) =>
              UpdateOrganizationsInfoEvent({
                payload: movies.data,
              })
            ),
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
              UpdatedTournamentsEvent({
                tournaments: response.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  

  GetTournamentLayoutsByOrganizationIdCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTournamentLayoutsByOrganizationIdCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .getTournamentLayoutsByOrganizationId(action.organizationId)
          .pipe(
            map((movies) =>
              UpdatedTournamentLayoutsEvent({
                tournamentLayouts: movies.data,
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );
  GetTournamentLayoutById$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetTournamentLayoutByIdCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .getTournamentLayoutById(
            action.organizationId,
            action.tournamentLayoutId
          )
          .pipe(
            map((movies) =>
              UpdatedTournamentLayoutsEvent({
                tournamentLayouts: [movies.data],
              })
            ),
            catchError(() => EMPTY)
          );
      })
    )
  );

  
  CreateTournamentCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateTournamentCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.createTournament(action.tournament).pipe(
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
                CreatedTournamentEvent({
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
  DeleteTournamentById$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteTournamentByIdCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.deleteTournament(action.tournamentId).pipe(
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
                DeletedTournamentEvent({
                  tournamentId: action.tournamentId,
                  data: response.data

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

  GetOrganizationsCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetOrganizationsCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .getOrganizations(action.pageNumber, action.pageSize)
          .pipe(
            map((response: IBaseResponse<Array<OrganizationEntity>>) => {
              return ConsultedOrganizationsEvent({
                organizations: response.data,
                pageNumber: action.pageNumber,
                pageSize: action.pageSize,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    )
  );
  CreateTournamentLayoutCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateTournamentLayoutCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .createTournamentLayout(action.tournamentLayout)
          .pipe(
            mergeMap((response: IBaseResponse<TournamentLayoutEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);

              if (status) {
                res.push(
                  UpdatedTournamentLayoutsEvent({
                    tournamentLayouts: [response.data],
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
  EditTournamentLayoutCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(EditTournamentLayoutCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .editTournamentLayout(action.tournamentLayout)
          .pipe(
            mergeMap((response: IBaseResponse<TournamentLayoutEntity>) => {
              const res: any[] = [
                TransactionResolvedEvent({
                  meta: response.meta,
                  transactionId: action.transactionId,
                }),
              ];

              const status = isASuccessResponse(response);

              if (status) {
                res.push(
                  UpdatedTournamentLayoutsEvent({
                    tournamentLayouts: [response.data],
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
  GetOrganizationById$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetOrganizationByIdCommand.type),
      mergeMap((action: any) => {
        return this.organizationAdapter
          .getOrganizationById(action.organizationId)
          .pipe(
            mergeMap((response: IBaseResponse<OrganizationEntity>) => {
              const res: any[] = [];
              if (action.transactionId) {
                res.push(
                  TransactionResolvedEvent({
                    meta: response.meta,
                    transactionId: action.transactionId,
                  })
                );
              }
              const status = isASuccessResponse(response);

              if (status) {
                res.push(
                  UpdatedOrganizationEvent({
                    organization: response.data,
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
