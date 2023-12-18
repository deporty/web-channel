import { ResourceEntity, TournamentEntity } from "@deporty-org/entities";

export interface AdministrationState {
  tournaments?: {
    [tournamentId: string]: TournamentEntity
  };
  resources?: {
    [resourceId: string]: ResourceEntity
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}

