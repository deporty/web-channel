import { Id } from '@deporty-org/entities/general';
import { IPlayerModel } from '@deporty-org/entities/players';
import { TeamEntity } from '@deporty-org/entities/teams';
import {
  GroupEntity,
  IntergroupMatchEntity,
  MatchEntity,
  NodeMatchEntity,
  RegisteredTeamEntity,
  TournamentEntity
} from '@deporty-org/entities/tournaments';

export interface TournamentsState {
  availableTeams?: TeamEntity[];
  currentIntergroupMatch?: IntergroupMatchEntity;
  currentMatch?: MatchEntity;
  currentNodeMatch?: NodeMatchEntity;
  currentTournament?: TournamentEntity;
  groupMatches: Array<MatchEntity>;
  groupedMatchesByTournament: {
    [id: Id]: any;
  };
  groups: { [id: Id]: GroupEntity };
  intergroupMatches: { [index: string]: IntergroupMatchEntity[] };
  markersTable?: any[];
  lessDefeatedFences: {
    [tournamentId: Id]: any[]
  };
  matchHistory?: {
    [index: string]: {
      stageOrder: number;
      groupedMatches: any;
    };
  };
  nodeMatches?: NodeMatchEntity[];
  players?: IPlayerModel[];
  positionTables?: any;
  registeredTeams?: RegisteredTeamEntity[];
  tournamentList: {
    [id: Id]: TournamentEntity;
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
