import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { createReducer, on } from '@ngrx/store';
import {
  ResetStatusCommand,
  UpdateAllPlayersEvent,
  UpdateAvailableTeamsToAddEvent,
  UpdateCurrentMatchByTeamsInStageGroupEvent,
  UpdateCurrentNodeMatchEvent,
  UpdateIntergroupMatchEvent,
  UpdateIntergroupMatchesEvent,
  ConsultedMainDrawByTournamentEvent,
  ConsultedMarkersTableEvent,
  UpdateMatchHistoryEvent,
  UpdateNewRegisteredTeamsEvent,
  ConsultedRegisteredTeamsEvent,
  ConsultedTournamentEvent,
  UpdatedTournamentsOverviewEvent,
  UpdatedCurrentIntergroupMatchEvent,
  TransactionResolvedEvent,
  TransactionDeletedEvent,
  ClearRegisteredTeamsCommand,
  ModifiedTournamentStatusEvent,
  ModifiedRegisteredTeamStatusEvent,
  ModifiedTournamentLocationsEvent,
  DeletedRegisteredTeamEvent,
  ConsultedGroupedMatchesByTournamentEvent,
  ModifiedTournamentRefereesEvent,
  ConsultedLessDefeatedFenceEvent,
  TournamentCostGottenEvent,
  ModifiedTournamentFinancialStatusEvent,
  ModifiedRequestForRequiredDocsEvent,
  UpdatedMembersIntoRegisteredTeamsEvent,
} from './tournaments.actions';
import { TournamentsState } from './tournaments.states';

export const tournamentsKey = 'tournaments';
export const initialState: TournamentsState = {
  tournamentList: {},
  lessDefeatedFences: {},
  transactions: {},
  groupedMatchesByTournament: {},
  intergroupMatches: {},
  groupMatches: [],
  groups: {},
  registeredMembers: {},
};

export const TournamentsReducer = createReducer<TournamentsState, any>(
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

  on(ConsultedTournamentEvent, (state, { tournament }) => {
    const newState: TournamentsState = { ...state };
    const tournamentList = { ...newState.tournamentList };
    tournamentList[tournament.id!] = tournament;
    (newState.currentTournament as TournamentEntity) = tournament;

    return { ...newState, tournamentList };
  }),
  on(ConsultedLessDefeatedFenceEvent, (state, { report, tournamentId }) => {
    const newState: TournamentsState = { ...state };
    const tournamentList = { ...newState.lessDefeatedFences };
    tournamentList[tournamentId] = report;

    return { ...newState, lessDefeatedFences: tournamentList };
  }),
  on(ResetStatusCommand, (state, {}) => {
    return initialState;
  }),
  on(ClearRegisteredTeamsCommand, (state, {}) => {
    return { ...state, registeredTeams: undefined };
  }),

  on(ConsultedRegisteredTeamsEvent, (state, { registeredTeams }) => {
    const newState: TournamentsState = { ...state, registeredTeams };

    return newState;
  }),
  on(ConsultedMarkersTableEvent, (state, { table }) => {
    const newState: TournamentsState = {
      ...state,

      markersTable: table,
    };
    return newState;
  }),
  on(UpdatedTournamentsOverviewEvent, (state, { tournaments }) => {
    const newData: any = {};
    for (const tour of tournaments) {
      newData[tour.id!] = tour;
    }
    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...state.tournamentList, ...newData },
    };
    return newState;
  }),
  on(ModifiedRequestForRequiredDocsEvent, (state, { status, tournamentId }) => {
    const newData: any = {};
    for (const tourId in state.tournamentList) {
      if (tourId != tournamentId) {
        newData[tourId] = state.tournamentList[tourId];
      } else {
        newData[tourId] = {
          ...state.tournamentList[tourId],
          requestRequiredDocs: status,
        } as TournamentEntity;
      }
    }
    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...newData },
    };
    return newState;
  }),
  on(ModifiedTournamentStatusEvent, (state, { tournament }) => {
    const newData: any = {};
    newData[tournament.id!] = tournament;
    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...state.tournamentList, ...newData },
    };
    return newState;
  }),
  on(ModifiedTournamentStatusEvent, (state, { tournament }) => {
    const newData: any = {};
    newData[tournament.id!] = tournament;
    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...state.tournamentList, ...newData },
    };
    return newState;
  }),
  on(ModifiedTournamentFinancialStatusEvent, (state, { tournament }) => {
    const newData: any = {};
    newData[tournament.id!] = tournament;
    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...state.tournamentList, ...newData },
    };
    return newState;
  }),
  on(TournamentCostGottenEvent, (state, { data, tournamentId }) => {
    const newData: any = { ...state.tournamentList };
    newData[tournamentId] = {
      ...state.tournamentList[tournamentId],
      financialStatements: {
        ...state.tournamentList[tournamentId].financialStatements,
        amount: data.matches.cost,
      },
    };

    const newState: TournamentsState = {
      ...state,

      tournamentList: { ...state.tournamentList, ...newData },
    };
    return newState;
  }),
  on(
    ModifiedRegisteredTeamStatusEvent,
    (state, { tournamentId, registeredTeam }) => {
      const prev = state.registeredTeams
        ? state.registeredTeams.filter((x) => x.id !== registeredTeam.id)
        : [];
      return { ...state, registeredTeams: [...prev, registeredTeam] };
    }
  ),
  on(
    UpdatedMembersIntoRegisteredTeamsEvent,
    (state, {  registeredTeam }) => {
      const prev = state.registeredTeams
        ? state.registeredTeams.filter((x) => x.id !== registeredTeam.id)
        : [];
      return { ...state, registeredTeams: [...prev, registeredTeam] };
    }
  ),
  on(
    DeletedRegisteredTeamEvent,
    (state, { tournamentId, registeredTeamId }) => {
      const prev = state.registeredTeams
        ? state.registeredTeams.filter((x) => x.id !== registeredTeamId)
        : [];
      return { ...state, registeredTeams: [...prev] };
    }
  ),
  on(
    ConsultedGroupedMatchesByTournamentEvent,
    (state, { matches, tournamentId }) => {
      return {
        ...state,
        groupedMatchesByTournament: {
          ...state.groupedMatchesByTournament,
          [tournamentId]: matches,
        },
      };
    }
  ),
  // on(UpdateGroupSpecification, (state, { group, stageId }) => {
  //   let newState: TournamentsState = { ...state };

  //   if (state.currentTournament && state.currentTournament.fixture) {
  //     const tempStages = [...state.currentTournament.fixture.stages];

  //     const a = tempStages.map((x) => {
  //       if (x.id == stageId) {
  //         return {
  //           ...x,
  //           groups: x.groups.map((g) => {
  //             if (g.label == group.label) {
  //               let matchesTransformed: any[] = [];
  //               if (group.matches) {
  //                 matchesTransformed = [...group.matches]
  //                   ?.sort((x, y) => {
  //                     return x.date !== undefined &&
  //                       y.date !== undefined &&
  //                       x.date > y.date
  //                       ? -1
  //                       : 1;
  //                   })
  //                   .map((match) => {
  //                     return {
  //                       ...match,
  //                       teamA:
  //                         group.teams
  //                           .filter((t) => {
  //                             return t.id === match.teamA.id;
  //                           })
  //                           .pop() || match.teamA,

  //                       teamB:
  //                         group.teams
  //                           .filter((t) => {
  //                             return t.id === match.teamB.id;
  //                           })
  //                           .pop() || match.teamB,
  //                     };
  //                   });
  //               }

  //               return { ...group, matches: matchesTransformed };
  //             } else {
  //               return g;
  //             }
  //           }),
  //         };
  //       } else {
  //         return x;
  //       }
  //     });

  //     newState = {
  //       ...state,
  //       currentTournament: {
  //         ...state.currentTournament,
  //         fixture: {
  //           ...state.currentTournament.fixture,
  //           stages: a,
  //         },
  //       },
  //     };
  //   }
  //   return newState;
  // }),
  on(UpdateAvailableTeamsToAddEvent, (state, { teams }) => {
    let newState: TournamentsState = { ...state, availableTeams: teams };

    return newState;
  }),
  on(UpdateMatchHistoryEvent, (state, { response, stageId, stageOrder }) => {
    let newState: TournamentsState = {
      ...state,
      matchHistory: {
        ...state.matchHistory,
        [stageId]: {
          groupedMatches: response,
          stageOrder,
        },
      },
    };
    return newState;
  }),
  on(UpdateNewRegisteredTeamsEvent, (state, { registeredTeams }) => {
    let newState: TournamentsState = {
      ...state,
      registeredTeams: state.registeredTeams
        ? [...state.registeredTeams, ...registeredTeams]
        : [...registeredTeams],
    };
    return newState;
  }),
  on(UpdateAllPlayersEvent, (state, { players }) => {
    let newState: TournamentsState = {
      ...state,
      players,
    };
    return newState;
  }),
  on(ConsultedMainDrawByTournamentEvent, (state, { nodeMatches }) => {
    let newState: TournamentsState = {
      ...state,
      nodeMatches,
    };
    return newState;
  }),
  on(UpdateCurrentMatchByTeamsInStageGroupEvent, (state, { match }) => {
    let newState: TournamentsState = {
      ...state,
      currentMatch: match,
    };
    return newState;
  }),
  on(UpdateCurrentNodeMatchEvent, (state, { nodeMatch }) => {
    let newState: TournamentsState = {
      ...state,
      currentNodeMatch: nodeMatch,
    };
    return newState;
  }),

  on(UpdateIntergroupMatchesEvent, (state, { intergroupMatches, stageId }) => {
    let newState: TournamentsState = {
      ...state,
      intergroupMatches: {
        ...state.intergroupMatches,
        [stageId]: intergroupMatches,
      },
    };
    return newState;
  }),
  on(UpdateIntergroupMatchEvent, (state, { intergroupMatch }) => {
    let newState: TournamentsState = {
      ...state,
      currentIntergroupMatch: intergroupMatch,
    };
    return newState;
  }),
  on(UpdatedCurrentIntergroupMatchEvent, (state, { intergroupMatch }) => {
    let newState: TournamentsState = {
      ...state,
      currentIntergroupMatch: intergroupMatch,
    };
    return newState;
  }),

  on(ModifiedTournamentLocationsEvent, (state, { tournament }) => {
    const prev: any = {};

    for (const tournamentId in state.tournamentList) {
      if (
        Object.prototype.hasOwnProperty.call(state.tournamentList, tournamentId)
      ) {
        const innerTournament = state.tournamentList[tournamentId];
        if (innerTournament.id === tournament.id) {
          prev[innerTournament.id!] = tournament;
        } else {
          prev[innerTournament.id!] = innerTournament;
        }
      }
    }
    let newState: TournamentsState = {
      ...state,
      tournamentList: prev,
    };
    return newState;
  }),
  on(ModifiedTournamentRefereesEvent, (state, { tournament }) => {
    const prev: any = {};

    for (const tournamentId in state.tournamentList) {
      if (
        Object.prototype.hasOwnProperty.call(state.tournamentList, tournamentId)
      ) {
        const innerTournament = state.tournamentList[tournamentId];
        if (innerTournament.id === tournament.id) {
          prev[innerTournament.id!] = tournament;
        } else {
          prev[innerTournament.id!] = innerTournament;
        }
      }
    }
    let newState: TournamentsState = {
      ...state,
      tournamentList: prev,
    };
    return newState;
  })
);
