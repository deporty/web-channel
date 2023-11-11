import { TournamentEntity } from "@deporty-org/entities";

export interface AdministrationState {
  tournaments?: {
    [tournamentId: string]: TournamentEntity
  };
}

