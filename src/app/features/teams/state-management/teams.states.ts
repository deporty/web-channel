import {
  MemberDescriptionType,
  MemberEntity,
  TeamEntity,
  SportEntity
} from '@deporty-org/entities/teams';

export interface TeamsState {
  teams: {
    [teamId: string]: TeamEntity;
  };
  sports: {
    [sportId: string]: SportEntity;
  };
  teamMembers: {
    [teamId: string]: MemberDescriptionType[];
  };
  filteredTeams?: TeamEntity[];
  currentTeam?: TeamEntity;
  currentMembers?: MemberDescriptionType[];
}
