import {
  Component,
  EventEmitter,
  Inject,
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
import { Observable, Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TEAMS_MAIN_PATH } from 'src/app/features/teams/constants';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetMatchsByGroupIdCommand } from '../../../state-management/matches/matches.actions';
import { selectMatchesByGroup } from '../../../state-management/matches/matches.selector';
import { selecRegisteredMembersByTeam } from '../../../state-management/tournaments/tournaments.selector';
import { GROUP_LETTERS } from '../components.constants';
import { isValid } from 'src/app/temp';
import { USER_INFORMATION_IT } from 'src/app/init-app';

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
  $matchesSuscription!: Subscription;

  constructor(
    private store: Store<any>,

    @Inject(USER_INFORMATION_IT) protected userInformation: any
  ) {
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

  isAllowed() {
    return isValid(this.userInformation.user);
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
    this.$matchesSuscription?.unsubscribe();
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
    this.$matchesSuscription = this.store
      .select(selectMatchesByGroup(this.group.id!))
      .subscribe((matches) => {
        this.matches = matches.sort((a, b) => {
          if (a.match.date && b.match.date) {
            const dateA =
              typeof a.match.date === 'string'
                ? new Date(a.match.date)
                : a.match.date;
            const dateB =
              typeof b.match.date === 'string'
                ? new Date(b.match.date)
                : b.match.date;

            if (dateA.getTime() < dateB.getTime()) {
              return -1;
            } else if (dateA.getTime() > dateB.getTime()) {
              return 1;
            }
          }
          return 0;
        });
        this.paginate();
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
        // const $team =  zip(
        //   this.store.select(selectTeamById(stadistic.teamId)),
        //   this.store.select(selecRegisteredMembersByTeam(stadistic.teamId))
        // ).pipe(
        //   map(([team, members]: [TeamEntity, MemberEntity[] | undefined]) => {
        //     return {
        //       team: team,
        //       members: members,
        //     };
        //   })
        // );

        const $team = this.store
          .select(selectTeamById(stadistic.teamId))
          .pipe(filter((team) => !!team));
        this.$currentTeams[stadistic.teamId] = $team;
      }
  }

  private getTeams() {
    const $teams = [];
    for (const teamId of this.group.teamIds) {
      // this.store.dispatch(
      //   GetTeamByIdCommand({
      //     teamId,
      //   })
      // );

      const $team = zip(
        this.store.select(selectTeamById(teamId)).pipe(filter((d) => !!d)),
        this.store.select(selecRegisteredMembersByTeam(teamId))
      ).pipe(
        map(([team, members]: [TeamEntity, MemberEntity[] | undefined]) => {
          return {
            team: team,
            members: members!,
          };
        }),
        filter((d) => {
          return !!d.team && !!d.members;
        })
      );

      $teams.push($team);
    }
    this.$consultedTeams = $teams;
  }
}
