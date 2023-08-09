import { Id } from '@deporty-org/entities/general';
import { TournamentLayoutEntity, TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { createAction, props } from '@ngrx/store';

export const GetMyOrganizationsCommand = createAction(
  '[OrganizationDetailComponent] GetMyOrganizationsCommand',
  props<{ email: string }>()
);

export const SelectCurrentOrganizationCommand = createAction(
  '[OrganizationDetailComponent] SelectCurrentOrganizationCommand',
  props<{ organizationId: Id }>()
);

export const GetTournamentLayoutsByOrganizationIdCommand = createAction(
  '[OrganizationDetailComponent] GetTournamentLayoutsByOrganizationIdCommand',
  props<{ organizationId: Id }>()
);

export const CreateTournamentCommand = createAction(
  '[OrganizationDetailComponent] CreateTournamentCommand',
  props<{ tournament: TournamentEntity; transactionId: string }>()
);
export const CreateTournamentLayoutCommand = createAction(
  '[OrganizationDetailComponent] CreateTournamentLayoutCommand',
  props<{ tournamentLayout: TournamentLayoutEntity; transactionId: string }>()
);
export const EditTournamentLayoutCommand = createAction(
  '[OrganizationDetailComponent] EditTournamentLayoutCommand',
  props<{ tournamentLayout: TournamentLayoutEntity; transactionId: string }>()
);
export const GetOrganizationByIdCommand = createAction(
  '[OrganizationDetailComponent] GetOrganizationByIdCommand',
  props<{ organizationId: Id }>()
);
export const GetTournamentLayoutByIdCommand = createAction(
  '[OrganizationDetailComponent] GetTournamentLayoutByIdCommand',
  props<{ organizationId: Id; tournamentLayoutId: Id }>()
);
export const ValidateSchemaCommand = createAction(
  '[] ValidateSchemaCommand',
  props<{ schema: TournamentLayoutSchema }>()
);
export const DeleteTournamentByIdCommand = createAction(
  '[OrganizationDetailComponent] DeleteTournamentByIdCommand',
  props<{ tournamentId: Id; transactionId: string }>()
);

export const GetOrganizationsCommand = createAction(
  '[OrganizationDetailComponent] GetOrganizationsCommand',
  props<{
    pageSize: number;
    pageNumber: number;
  }>()
);



export const GetTournamentsByOrganizationAndTournamentLayoutCommand = createAction(
  '[OrganizationDetailComponent] GetTournamentsByOrganizationAndTournamentLayoutCommand',
  props<{
    organizationId: Id;
    tournamentLayoutId: Id;
    includeDraft: boolean;
  }>()
);
