import { Id } from '@deporty-org/entities';
import {
  MemberDescriptionType,
  MemberEntity,
  SportEntity,
  TeamEntity,
} from '@deporty-org/entities/teams';
import { createAction, props } from '@ngrx/store';

export const ConsultedTeamsEvent = createAction(
  '[TeamsEffects] ConsultedTeamsEvent',
  props<{ pageSize: number; pageNumber: number; teams: Array<TeamEntity> }>()
);

export const ConsultedTeamByIdEvent = createAction(
  '[TeamsEffects] ConsultedTeamByIdEvent',
  props<{ team: TeamEntity }>()
);
export const ConsultedSportByIdEvent = createAction(
  '[TeamsEffects] ConsultedSportByIdEvent',
  props<{ sport: SportEntity }>()
);

export const ConsultedFilteredTeamsEvent = createAction(
  '[TeamsEffects] ConsultedFilteredTeamsEvent',
  props<{ teams: Array<TeamEntity> }>()
);

export const ConsultedTeamMembersEvent = createAction(
  '[TeamsEffects] ConsultedTeamMembersEvent',
  props<{ members: Array<MemberDescriptionType>, teamId: Id }>()
);

export const ConsultedMemberEvent = createAction(
  '[TeamsEffects] ConsultedMemberEvent',
  props<{ member: MemberDescriptionType, teamId: Id }>()
);
