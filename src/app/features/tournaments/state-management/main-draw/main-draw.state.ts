import { Id } from '@deporty-org/entities/general';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';

export interface MainDrawState {
  nodeMatches: {
    [tournamentId: Id]: { [nodeMatchId: Id]: NodeMatchEntity };
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
