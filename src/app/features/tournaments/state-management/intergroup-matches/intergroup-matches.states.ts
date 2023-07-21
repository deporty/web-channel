import { Id } from '@deporty-org/entities/general';
import {
  FixtureStageEntity,
  IntergroupMatchEntity,
} from '@deporty-org/entities/tournaments';

export interface IntergroupMatchesState {
  intergroupMatches: {
    [intergroupMatchId: Id]: {
      intergroupMatch: IntergroupMatchEntity;
      fixtureStageId: Id;
      tournamentId: Id;
    };
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
