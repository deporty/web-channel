import { Id } from '@deporty-org/entities/general';
import { createReducer, on } from '@ngrx/store';
import {
  ConsultedGroupsEvent,
  ConsultedPositionTableGroupEvent,
  CreateGroupEvent,
  DeleteGroupsByFixtureIdCommand,
  DeletedGroupEvent,
  DeletedTeamsInGroupEvent,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
  UpdateGroupSpecificationEvent,
  UpdatePositionTablesEvent,
} from './groups.actions';
import { GroupsState } from './groups.states';

export const groupsKey = 'groups';
export const initialState: GroupsState = {
  groups: {},
  transactions: {},
  positionsTables: {},
};

export const GroupsReducer = createReducer<GroupsState, any>(
  initialState,

  on(TransactionResolvedEvent, (state, { transactionId, meta }) => {
    const prevTransaction = state.transactions[transactionId];

    const newState = { ...state };
    if (!prevTransaction) {
      return {
        ...state,
        transactions: { ...state.transactions, [transactionId]: meta },
      };
    }
    return newState;
  }),
  on(TransactionDeletedEvent, (state, { transactionId }) => {
    const newState = { ...state };
    const transactions = { ...newState.transactions };

    delete transactions[transactionId];

    return {
      ...state,
      transactions,
    };
  }),

  on(CreateGroupEvent, (state, { tournamentId, group }) => {
    const prev = { ...state.groups };
    prev[group.id as Id] = { group, tournamentId };

    return { ...state, groups: prev };
  }),
  on(
    ConsultedGroupsEvent,
    (state, { tournamentId, fixtureStageId, groups }) => {
      const prev = { ...state.groups };
      if (groups) {
        for (const group of groups) {
          prev[group.id as Id] = { group, tournamentId };
        }
      }
      return { ...state, groups: prev };
    }
  ),
  on(
    ConsultedPositionTableGroupEvent,
    (state, { tournamentId, fixtureStageId, groupId, positionTable }) => {
      const prev = { ...state.groups };
      const prevGroup = prev[groupId as Id];

      if (prevGroup) {
        prev[groupId as Id] = {
          ...prevGroup,
          group: { ...prevGroup.group, positionsTable: positionTable },
        };
      }
      return { ...state, groups: prev };
    }
  ),
  on(UpdateGroupSpecificationEvent, (state, { group, tournamentId }) => {
    const prev = { ...state.groups };

    prev[group.id!] = { group, tournamentId };
    return { ...state, groups: prev };
  }),
  on(DeletedGroupEvent, (state, { groupId }) => {
    const temp: any = {};
    for (const key in state.groups) {
      if (Object.prototype.hasOwnProperty.call(state.groups, key)) {
        const element = state.groups[key];

        if (key != groupId) {
          temp[key] = element;
        }
      }
    }
    return { ...state, groups: temp };
  }),
  on(DeleteGroupsByFixtureIdCommand, (state, { fixtureStageId }) => {
    const temp: any = {};
    for (const key in state.groups) {
      if (Object.prototype.hasOwnProperty.call(state.groups, key)) {
        const element = state.groups[key];

        if (element.group.fixtureStageId != fixtureStageId) {
          temp[key] = element;
        }
      }
    }
    return { ...state, groups: temp };
  }),
  on(DeletedTeamsInGroupEvent, (state, { group, tournamentId }) => {
    const temp: any = {};
    for (const key in state.groups) {
      if (Object.prototype.hasOwnProperty.call(state.groups, key)) {
        const element = state.groups[key];

        if (key != group.id) {
          temp[key] = element;
        } else {
          temp[key] = {
            group,
            tournamentId,
          };
        }
      }
    }
    return { ...state, groups: temp };
  }),

  on(UpdatePositionTablesEvent, (state, { table, groupId }) => {
    const temp: GroupsState = JSON.parse(JSON.stringify(state));

    temp.groups[groupId].group.positionsTable = table;

    return temp;
  })
);
