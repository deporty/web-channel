import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Id } from '@deporty-org/entities/general';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import {
  GroupEntity,
  MatchEntity,
  MatchStatusType,
  PointsStadistics,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TEAMS_MAIN_PATH } from 'src/app/features/teams/constants';
import { GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetLocationsByIdsCommand } from '../../../state-management/locations/locations.commands';
import { GetMatchsByGroupIdCommand } from '../../../state-management/matches/matches.actions';
import { selectMatchesByGroup } from '../../../state-management/matches/matches.selector';
import { GROUP_LETTERS } from '../components.constants';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
})
export class GroupCardComponent implements OnInit, OnChanges, OnDestroy {
  $consultedTeams!: Observable<{
    team: TeamEntity;
    members: MemberEntity[];
  }>[];
  $currentTeams: any;
  $matches!: Observable<
    {
      tournamentId: string;
      fixtureStageId: string;
      groupId: string;
      match: MatchEntity;
    }[]
  >;
  @Input('add-match-flag') addMatchFlag;
  @ViewChild('addMatch', {
    static: false,
  })
  addMatchIcon!: MatIcon;
  @Input('add-team-flag') addTeamFlag;
  @ViewChild('addTeam', {
    static: false,
  })
  addTeamIcon!: MatIcon;
  @Input('consult') consult!: boolean | undefined;
  consulted = false;
  @Input('delete-team-flag') deleteTeamFlag;
  @Input('edit-match-flag') editMatchFlag;
  @Input('group') group!: GroupEntity;
  length = 0;
  @Input('let-editions') letEditions = false;
  letters = GROUP_LETTERS;
  currentMatches: {
    tournamentId: string;
    fixtureStageId: string;
    groupId: string;
    match: MatchEntity;
  }[];

  matches!: {
    tournamentId: string;
    fixtureStageId: string;
    groupId: string;
    match: MatchEntity;
  }[];

  navigationSubscription!: Subscription;
  @Output('on-add-match') onAddMatch: EventEmitter<any>;
  @Output('on-add-team') onAddTeam: EventEmitter<any>;
  @Output('on-delete-team') onDeleteTeam: EventEmitter<any>;
  @Output('on-edit-match') onEditMatch: EventEmitter<any>;
  @Output('on-view-match') onViewMatch: EventEmitter<any>;
  pageEvent!: PageEvent;
  pageSize = 2;
  pageSizeOptions: number[] = [2];
  paginatedMatches: {
    tournamentId: string;
    fixtureStageId: string;
    groupId: string;
    match: MatchEntity;
  }[][];
  results!: PointsStadistics[];
  @Input('tournament-id') tournamentId!: Id;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;
  @Input('view-match-flag') viewMatchFlag;

  constructor(private store: Store<any>) {
    this.addTeamFlag = false;
    this.addMatchFlag = false;
    this.editMatchFlag = false;
    this.deleteTeamFlag = false;
    this.viewMatchFlag = false;
    this.onAddTeam = new EventEmitter();
    this.onDeleteTeam = new EventEmitter();
    this.onAddMatch = new EventEmitter();
    this.onEditMatch = new EventEmitter();
    this.onViewMatch = new EventEmitter();

    this.currentMatches = [];
    this.$currentTeams = {};
    this.paginatedMatches = [];
  }

  addTeam() {}

  deleteTeam(team: Observable<any>) {
    this.navigationSubscription = team.subscribe((t) => {
      this.onDeleteTeam.emit(t);
    });
  }

  navigate(
    team: Observable<{
      team: TeamEntity;
      members: MemberEntity[];
    }>
  ) {
    this.navigationSubscription = team.subscribe((t) => {
      window.open(
        ['.', TEAMS_MAIN_PATH, 'team', t.team.id!].join('/'),
        '_blank'
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.consult && changes.consult.currentValue) {
      if (!!changes.consult.currentValue) {
        if (!this.consulted) {
          this.getMatches();
          this.getTeams();
          this.getTeamsForPositionTable();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  ngOnInit(): void {}

  onPage(event: PageEvent) {
    this.currentMatches = this.paginatedMatches[event.pageIndex];
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  private getMatches() {
    const states: MatchStatusType[] = [
      'completed',
      'published',
      'in-review',
      'running',
    ];
    if (this.letEditions) {
      states.push('editing');
    }
    this.store.dispatch(
      GetMatchsByGroupIdCommand({
        tournamentId: this.tournamentId,
        fixtureStageId: this.group.fixtureStageId,
        groupId: this.group.id!,
        states,
      })
    );
    this.store
      .select(selectMatchesByGroup(this.group.id!))
      .subscribe((matches) => {
        this.matches = matches;
        this.paginate();
        const ids = new Set(
          matches.map((m) => m.match.locationId).filter((x) => !!x)
        );
        if (ids && ids.size > 0) {
          this.store.dispatch(
            GetLocationsByIdsCommand({
              ids: Array.from(ids) as string[],
            })
          );
        }
      });
  }

  private paginate() {
    if (this.matches.length > 0) {
      let temp = [];
      for (let i = 0; i < this.matches.length; i++) {
        const match = this.matches[i];

        temp.push({ ...match });
        if (temp.length % this.pageSize === 0) {
          this.paginatedMatches.push([...temp]);
          temp = [];
        }
      }
      if (temp.length > 0) {
        this.paginatedMatches.push(temp);
      }

      this.currentMatches = this.paginatedMatches[0];
    }
  }
  private getTeamsForPositionTable() {
    if (this.group.positionsTable)
      for (const stadistic of this.group.positionsTable?.table) {
        const $team = this.store
          .select(selectTeamWithMembersById(stadistic.teamId))
          .pipe(
            filter((team) => !!team),

            map((team) => team.team)
          );
        this.$currentTeams[stadistic.teamId] = $team;
      }
  }

  private getTeams() {
    const $teams = [];
    for (const teamId of this.group.teamIds) {
      this.store.dispatch(
        GetTeamByIdCommand({
          teamId,
        })
      );

      const $team = this.store.select(selectTeamWithMembersById(teamId));
      $teams.push($team);
    }
    this.$consultedTeams = $teams;
  }
}
