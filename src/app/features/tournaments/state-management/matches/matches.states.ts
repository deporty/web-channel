import { Id } from '@deporty-org/entities/general';
import { MatchEntity } from '@deporty-org/entities/tournaments';

export interface MatchesState {
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
  matches: {
    [id: Id]: {
      tournamentId: Id;
      fixtureStageId: Id;
      groupId: Id;
      match: MatchEntity;
    };
  };
}
