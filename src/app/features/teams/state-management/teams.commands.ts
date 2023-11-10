import { Id } from '@deporty-org/entities/general';
import { createAction, props } from '@ngrx/store';

export const GetTeamsCommand = createAction(
  '[TeamsComponent] GetTeamsCommand',
  props<{ pageSize: number; pageNumber: number }>()
);

export const GetSportByIdCommand = createAction(
  '[TeamsComponent] GetSportByIdCommand',
  props<{ sportId: Id }>()
);
export const GetTeamByIdCommand = createAction(
  '[TeamsComponent] GetTeamByIdCommand',
  props<{ teamId: Id }>()
);
export const GetTeamsByIdsCommand = createAction(
  '[TeamsComponent] GetTeamsByIdsCommand',
  props<{ teamIds: Id[] }>()
);

export const GetTeamsByFiltersCommand = createAction(
  '[TeamsComponent] GetTeamsByFiltersCommand',
  props<{ filters: any }>()
);

export const GetTeamsMembersCommand = createAction(
  '[TeamComponent] GetTeamsMembersCommand',
  props<{ teamId: string }>()
);

export const GetMemberByIdCommand = createAction(
  '[TeamComponent] GetMemberByIdCommand',
  props<{ teamId: Id; memberId: Id }>()
);

