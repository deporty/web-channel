import { Id } from '@deporty-org/entities/general';
import { Store, createSelector } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { TournamentsState } from './tournaments.states';
import { zip } from 'rxjs';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';

export const selectTournamentFeature = (state: AppState) => state.tournaments;

export const selectTransactionById = (transactionId: string) =>
  createSelector(
    selectTournamentFeature,
    (state: TournamentsState) => state.transactions[transactionId]
  );
export const selectAllTournaments = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => Object.values(state.tournamentList)
);
export const selectTournaments = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.tournamentList
);
export const selectTournamentsByOrganizationAndLayout = (
  organizationId: Id,
  tournamentLayoutId: Id
) =>
  createSelector(selectTournamentFeature, (state: TournamentsState) =>
    Object.values(state.tournamentList).filter((tour) => {
      return (
        tour.organizationId == organizationId &&
        tour.tournamentLayoutId == tournamentLayoutId
      );
    })
  );

export const selectCurrentTournament = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.currentTournament
);

export const selectTournamentById = (tournamentId: Id) =>
  createSelector(selectTournamentFeature, (state: TournamentsState) =>
    Object.values(state.tournamentList)
      .filter((x) => x.id == tournamentId)
      .pop()
  );
export const selectGroupedMatchesByTournamentId = (tournamentId: Id) =>
  createSelector(
    selectTournamentFeature,
    (state: TournamentsState) => state.groupedMatchesByTournament[tournamentId]
  );

// export const selectFixtureStages = createSelector(
//   selectTournamentFeature,
//   (state: TournamentsState) => Object.values(state.fixtureStages)
// );

// export const selectCurrentTournamentFixture = createSelector(
//   selectTournamentFeature,
//   (state: TournamentsState) => state.fixtureStages
// );

export const selectMarkersTable = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.markersTable
);
export const selectLessDefeatedFence = (tournamentId: Id) =>
  createSelector(
    selectTournamentFeature,
    (state: TournamentsState) => state.lessDefeatedFences[tournamentId]
  );

export const selecRegisteredTeams = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.registeredTeams
);

export const selecRegisteredMembersByTeam = (teamId: Id) =>
  createSelector(
    selectTournamentFeature,
    (state: TournamentsState) =>
    state.registeredTeams ? state.registeredTeams.filter((x) => x.teamId === teamId).pop()?.members! : []
  );
export const selecRegisteredMembersByTeamAndMemberId = (
  teamId: Id,
  memberId: Id
) =>
  createSelector(selectTournamentFeature, (state: TournamentsState) =>
    state.registeredTeams
      ?.filter((x) => x.teamId === teamId)
      .pop()
      ?.members.filter((m) => m.id === memberId)
      .pop()
  );

export const selectTeamWithRegisteredMembers = (
  store: Store<AppState>,
  teamId: Id
) =>
  zip(
    store.select(selectTeamById(teamId)),
    store.select(selecRegisteredMembersByTeam(teamId))
  );
export const selecRegisteredTeamByTeamId = (teamId: Id) =>
  createSelector(selectTournamentFeature, (state: TournamentsState) =>
    state.registeredTeams?.filter((x) => x.teamId === teamId).pop()
  );

export const selectAvailablesTeamsToAdd = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.availableTeams
);

export const selectMatchHistory = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.matchHistory
);

export const selectPlayers = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.players
);

export const selectCurrentMatch = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.currentMatch
);

export const selectCurrentNodeMatch = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.currentNodeMatch
);

// export const selectIntergroupMatches = createSelector(
//   selectTournamentFeature,
//   (state: TournamentsState) => state.intergroupMatches
// );

export const selectCurrentIntergroupMatch = createSelector(
  selectTournamentFeature,
  (state: TournamentsState) => state.currentIntergroupMatch
);

export const selectGroupById = (id: Id) =>
  createSelector(
    selectTournamentFeature,
    (state: TournamentsState) => state.groups[id]
  );

export const selectGroupByFixtureStageId = (fixtureStageId: Id) =>
  createSelector(selectTournamentFeature, (state: TournamentsState) =>
    Object.values(state.groups).filter(
      (x) => x.fixtureStageId === fixtureStageId
    )
  );
