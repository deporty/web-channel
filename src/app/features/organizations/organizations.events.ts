import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const TransactionResolvedEvent = createAction(
  '[OrganizationEffects] TransactionResolvedEvent',
  props<{
    transactionId: string;
    meta: {
      code: string;
      message: string;
    };
  }>()
);
export const TransactionDeletedEvent = createAction(
  '[OrganizationEffects] TransactionDeletedEvent',
  props<{ transactionId: string }>()
);
export const CardsReportGottenEvent = createAction(
  '[OrganizationEffects] CardsReportGottenEvent',
  props<{tournamentId: string, report: any }>()
);
export const UpdateOrganizationsInfoEvent = createAction(
  '[OrganizationEffects] UpdateOrganizationsInfoEvent',
  props<{ payload: Array<OrganizationEntity> }>()
);

export const UpdatedTournamentLayoutsEvent = createAction(
  '[OrganizationEffects] UpdatedTournamentLayoutsEvent',
  props<{
    tournamentLayouts: Array<TournamentLayoutEntity>;
  }>()
);
export const CreatedTournamentEvent = createAction(
  '[OrganizationEffects] CreatedTournamentEvent',
  props<{
    tournament: TournamentEntity;
  }>()
);

export const ConsultedOrganizationsEvent = createAction(
  '[OrganizationsEffects] ConsultedOrganizationsEvent',
  props<{
    pageSize: number;
    pageNumber: number;
    organizations: Array<OrganizationEntity>;
  }>()
);

export const UpdatedOrganizationEvent = createAction(
  '[OrganizationsEffects] UpdatedOrganizationEvent',
  props<{
    organization: OrganizationEntity;
  }>()
);
export const DeletedTournamentEvent = createAction(
  '[OrganizationsEffects] DeletedTournamentEvent',
  props<{
    tournamentId: Id;
    data: TournamentEntity | null;
  }>()
);


export const UpdatedTournamentsEvent = createAction(
  '[OrganizationsEffects] UpdatedTournamentsEvent',
  props<{ tournaments: Array<TournamentEntity> }>()
);
export const UpdateSchemaStatusEvent = createAction(
  '[OrganizationsEffects] UpdateSchemaStatusEvent',
  props<{ status: boolean }>()
);
