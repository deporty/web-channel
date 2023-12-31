import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';

export interface OrganizationsState {
  status: 'loading' | 'updated';
  isValidSchema: boolean;
  currentOrganization?: OrganizationEntity;
  myOrganizations?: Array<OrganizationEntity>;
  tournamentLayouts: { [id: string]: TournamentLayoutEntity };
  myTournaments: Array<TournamentEntity>;
  tournamentsReports: {
    [tournamentId: string]: any
  }
  tournamentCreatedFlag: boolean;
  organizations: { [index: Id]: OrganizationEntity };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
