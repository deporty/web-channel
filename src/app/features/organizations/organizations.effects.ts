import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';

import {
  CreatedTournamentEvent,
  DeletedTournamentEvent,
  TransactionResolvedEvent,
  UpdateOrganizationsInfoEvent,
  UpdatedTournamentLayoutsEvent,
  UpdatedTournamentsEvent,
  UpdatedOrganizationEvent,
  ConsultedOrganizationsEvent,
  UpdateSchemaStatusEvent,
  CardsReportGottenEvent,
} from './organizations.events';
import {
  CreateTournamentCommand,
  CreateTournamentLayoutCommand,
  DeleteTournamentByIdCommand,
  EditTournamentLayoutCommand,
  GetCardsReportCommand,
  GetMyOrganizationsCommand,
  GetOrganizationByIdCommand,
  GetOrganizationsCommand,
  GetTournamentLayoutByIdCommand,
  GetTournamentLayoutsByOrganizationIdCommand,
  GetTournamentsByOrganizationAndTournamentLayoutCommand,
  ValidateSchemaCommand,
} from './organizations.commands';
import { TournamentAdapter } from '../tournaments/adapters/tournament.adapter';
import { OrganizationAdapter } from './service/organization.adapter';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { isASuccessResponse } from 'src/app/core/helpers/general.helpers';
import { Store } from '@ngrx/store';
import { selectTournamentLayoutById } from './organizations.selector';

@Injectable()
export class OrganizationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,

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
  ValidateSchemaCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(ValidateSchemaCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.validateSchema(action.schema).pipe(
          map((response) =>
            UpdateSchemaStatusEvent({
              status: response.data,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  GetCardsReportCommand$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(GetCardsReportCommand.type),
      mergeMap((action: any) => {
        return this.tournamentAdapter.getCardsReport(action.tournamentId).pipe(
          map((response) => {
            return CardsReportGottenEvent({
              report: response.data,
              tournamentId: action.tournamentId
            });
          }),
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
        return this.store
          .select(selectTournamentLayoutById(action.tournamentLayoutId))
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
        return this.organizationAdapter
          .getTournamentLayoutById(
            data.action.organizationId,
            data.action.tournamentLayoutId
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
        return this.tournamentAdapter
          .deleteTournament(action.tournamentId)
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
                  DeletedTournamentEvent({
                    tournamentId: action.tournamentId,
                    data: response.data,
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
