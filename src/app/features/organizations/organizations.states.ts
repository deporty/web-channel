import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';

export interface OrganizationsState {
  status: 'loading' | 'updated';
  currentOrganization?: OrganizationEntity;
  myOrganizations?: Array<OrganizationEntity>;
  tournamentLayouts: { [id: string]: TournamentLayoutEntity };
  myTournaments: Array<TournamentEntity>;
  tournamentCreatedFlag: boolean;
  organizations: { [index: Id]: OrganizationEntity };
  transactions: { [id: string]:  {
    code: string;
    message: string;
  }};
}
