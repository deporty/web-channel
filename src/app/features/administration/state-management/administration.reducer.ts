import { createReducer, on } from '@ngrx/store';
import { AdministrationState } from './administration.states';
import {
  ConsultedPermissionsEvent,
  ConsultedResourcesEvent,
  ConsultedRolesEvent,
  TransactionDeletedEvent,
  TransactionResolvedEvent,
} from './administration.events';

export const administrationKey = 'administration';
export const initialState: AdministrationState = {
  transactions: {},
};

export const AdministrationReducer = createReducer<AdministrationState, any>(
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
  on(ConsultedRolesEvent, (state, { roles }) => {
    const resourcesMap: any = {};

    for (const rol of roles) {
      resourcesMap[rol.id!] = rol;
    }

    return {
      ...state,
      roles: resourcesMap,
    };
  }),
  on(ConsultedPermissionsEvent, (state, { permissions }) => {
    const resourcesMap: any = {};

    for (const permission of permissions) {
      resourcesMap[permission.id!] = permission;
    }

    return {
      ...state,
      permissions: resourcesMap,
    };
  }),
  on(ConsultedResourcesEvent, (state, { resources }) => {
    const resourcesMap: any = {};

    for (const resource of resources) {
      resourcesMap[resource.id!] = resource;
    }

    return {
      ...state,
      resources: resourcesMap,
    };
  })
);
