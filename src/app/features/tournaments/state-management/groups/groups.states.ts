import { Id } from '@deporty-org/entities/general';
import {
  GroupEntity,
  PointsStadistics,
} from '@deporty-org/entities/tournaments';

export interface GroupsState {
  groups: {
    [id: Id]: {
      group: GroupEntity;
      tournamentId: Id;
    };
  };
  positionsTables: {
    [groupId: Id]: PointsStadistics[];
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}
