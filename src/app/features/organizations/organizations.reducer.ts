import { createReducer, on } from '@ngrx/store';
import { SelectCurrentOrganizationCommand } from './organizations.commands';
import {
  CreatedTournamentEvent,
  DeletedTournamentEvent,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
  UpdateOrganizationsInfoEvent,
  UpdatedTournamentLayoutsEvent,
  UpdatedOrganizationEvent,
  ConsultedOrganizationsEvent,
  UpdatedTournamentsEvent,
  UpdateSchemaStatusEvent,
} from './organizations.events';
import { OrganizationsState } from './organizations.states';

export const organizationsKey = 'organizations';
export const initialState: OrganizationsState = {
  status: 'loading',
  tournamentLayouts: {},
  isValidSchema: true,
  myTournaments: [],
  tournamentCreatedFlag: false,

  organizations: {},
  transactions: {},
};

export const OrganizationsReducer = createReducer<OrganizationsState, any>(
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
  on(UpdateOrganizationsInfoEvent, (state, { payload }) => {
    return { ...state, myOrganizations: payload, status: 'updated' };
  }),
  on(UpdateSchemaStatusEvent, (state, { status }) => {
    return { ...state,  isValidSchema: status };
  }),
  on(SelectCurrentOrganizationCommand, (state, { organizationId }) => {
    const org = state.myOrganizations
      ?.filter((x) => x.id == organizationId)
      .pop();
    return { ...state, currentOrganization: org };
  }),
  on(UpdatedTournamentLayoutsEvent, (state, { tournamentLayouts }) => {
    const tournamentLayoutsPrev = { ...state.tournamentLayouts };

    for (const t of tournamentLayouts) {
      tournamentLayoutsPrev[t.id!] = t;
    }
    return { ...state, tournamentLayouts: tournamentLayoutsPrev };
  }),
  on(CreatedTournamentEvent, (state, { tournament }) => {
    const myAllTournaments = [...state.myTournaments];
    myAllTournaments.push(tournament);

    return {
      ...state,
      myTournaments: myAllTournaments,
      tournamentCreatedFlag: true,
    };
  }),
  on(DeletedTournamentEvent, (state, { tournamentId, data }) => {
    if (data) {
      const myAllTournaments = [...state.myTournaments].filter(
        (x) => x.id !== tournamentId
      );

      myAllTournaments.push(data);
      return {
        ...state,
        myTournaments: myAllTournaments,
      };
    } else {
      const myAllTournaments = [...state.myTournaments].filter(
        (x) => x.id !== tournamentId
      );

      return {
        ...state,
        myTournaments: myAllTournaments,
      };
    }
  }),
  on(
    ConsultedOrganizationsEvent,
    (state, { organizations, pageNumber, pageSize }) => {
      const prev = state.organizations ? { ...state.organizations } : {};

      for (const org of organizations) {
        prev[org.id || ''] = org;
      }
      let newState: OrganizationsState = {
        ...state,
        organizations: prev,
      };
      return newState;
    }
  ),
  on(UpdatedOrganizationEvent, (state, { organization }) => {
    const prev = state.organizations ? { ...state.organizations } : {};

    prev[organization.id || ''] = organization;

    let newState: OrganizationsState = {
      ...state,
      organizations: prev,
    };
    return newState;
  }),
  on(UpdatedTournamentsEvent, (state, { tournaments }) => {
    let newState: OrganizationsState = {
      ...state,
      myTournaments: tournaments,
    };
    return newState;
  })
);
