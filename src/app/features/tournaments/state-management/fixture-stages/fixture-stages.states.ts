import { Id } from '@deporty-org/entities/general';
import { FixtureStageEntity } from '@deporty-org/entities/tournaments';

export interface FixtureStagesState {
  fixtureStages: {
    [tournamentId: Id]: { [fixtureStageId: Id]: FixtureStageEntity };
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
