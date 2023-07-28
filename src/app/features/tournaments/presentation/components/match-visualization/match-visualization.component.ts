import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Id, MemberEntity, TeamEntity } from '@deporty-org/entities';
import {
  LocationEntity,
  PlaygroundEntity,
} from '@deporty-org/entities/locations';
import { IPlayerModel } from '@deporty-org/entities/players';
import {
  GOAL_KINDS,
  MATCH_STATUS,
  MatchEntity,
  PlayerForm,
  Stadistics,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { getBreakpoint } from 'src/app/core/helpers/general.helpers';
import { PadComponent } from 'src/app/core/presentation/components/pad/pad.component';
import {
  GetTeamByIdCommand,
  GetTeamsMembersCommand,
} from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetLocationByIdCommand } from '../../../state-management/locations/locations.commands';
import { selectLocationById } from '../../../state-management/locations/locations.selector';
import { DEFAULT_SHIELD_IMG } from 'src/app/app.constants';

@Component({
  selector: 'app-match-visualization',
  templateUrl: './match-visualization.component.html',
  styleUrls: ['./match-visualization.component.scss'],
})
export class MatchVisualizationComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{

  
  teamAShield: string;
  teamBShield: string;

  @ViewChild('captainA', { static: false }) captainPadA!: PadComponent;
  @ViewChild('captainB', { static: false }) captainPadB!: PadComponent;
  date: Date | undefined;
  dialogNoMebers!: MatDialogRef<any> | null;
  extraDataToogleA!: boolean;
  extraDataToogleB!: boolean;
  extraGolesA!: number;
  extraGolesB!: number;
  extraGolesDescriptionA!: string;
  extraGolesDescriptionB!: string;
  formGroup!: UntypedFormGroup;
  goalKind = GOAL_KINDS;
  matchStatus: any = MATCH_STATUS;
  groupIndex!: number;
  groupLabel: any;
  @ViewChild('judge', { static: false }) judge!: PadComponent;
  judgeSignaturePrev!: string;
  @ViewChild('locationSelect', { static: false }) locationSelect!: MatSelect;
  @Input() locations!: LocationEntity[];
  match!: MatchEntity;
  @Input() meta: any = {};
  minute!: number;
  minuteCard!: number;
  observations!: string | undefined;
  @Output('on-save') onSave: EventEmitter<any>;
  playersA!: IPlayerModel[];
  playersB!: IPlayerModel[];
  playersForm!: PlayerForm;
  @ViewChild(MatDatepicker, { static: false }) datePicker!: MatDatepicker<any>;
  @ViewChild('playgroundSelect', { static: false })
  playgroundSelect!: MatSelect;
  playgrounds!: Array<PlaygroundEntity>;
  redCardsTeamA: number;
  redCardsTeamB: number;
  redMinuteCard!: number;
  selectedKindGoal!: string;
  selectedLocation!: Id | undefined;
  selectedPlayground!: PlaygroundEntity | undefined;
  signatureAPrev!: string;
  signatureBPrev!: string;
  stadistics!: Stadistics;
  stageId!: string;
  status: string;

  tournamentId!: string;
  yellowCardsTeamA: number;
  yellowCardsTeamB: number;

  teamA!: { team: TeamEntity; members: MemberEntity[] };
  teamB!: { team: TeamEntity; members: MemberEntity[] };

  isDesktop = true;
  $location!: Observable<LocationEntity | undefined>;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {

    this.teamAShield = DEFAULT_SHIELD_IMG;
    this.teamBShield = DEFAULT_SHIELD_IMG;
    this.onSave = new EventEmitter();
    this.yellowCardsTeamA = 0;
    this.yellowCardsTeamB = 0;
    this.redCardsTeamA = 0;
    this.redCardsTeamB = 0;

    this.status = '';
    this.stadistics = {
      teamA: [],
      teamB: [],
      extraGoalsTeamA: {
        goals: 0,
      },

      extraGoalsTeamB: {
        goals: 0,
      },
    };
  }

  knowScreen(width: number) {
    const breakpoint = getBreakpoint(width);
    this.isDesktop = breakpoint != 'xs';
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onInput() {
    this.datePicker.open();
  }
  calculateGoals() {
    const calc = (stadistics: Stadistics, team: 'teamA' | 'teamB') => {
      let teamGoals = 0;
      const map = {
        teamA: this.extraGolesA,
        teamB: this.extraGolesB,
      };
      for (const playerStadistic of stadistics[team] || []) {
        teamGoals += playerStadistic.totalGoals || 0;
      }
      return teamGoals + (map[team] || 0);
    };

    const teamAGoals = calc(this.stadistics, 'teamA');
    const teamBGoals = calc(this.stadistics, 'teamB');

    if (!this.match.score) {
      this.match.score = {
        teamA: 0,
        teamB: 0,
      };
    }
    this.match.score.teamA = teamAGoals;
    this.match.score.teamB = teamBGoals;
  }

  getObjectKeys(obj: any) {
    return Object.entries(obj);
  }

  getDate(date?: Date) {
    return date
      ? `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
      : '';
  }

  getHour(date?: Date) {
    return date ? `${date.getHours()}:${date.getMinutes()}` : '12:00';
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    window.onresize = (event) => {
      const window = event.target as Window;
      this.knowScreen(window.innerWidth);
    };

    this.knowScreen(window.innerWidth);
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.match = JSON.parse(JSON.stringify(this.data.match));


    
    if (this.teamA.team.miniShield) {
      this.teamAShield = this.teamA.team.miniShield;
    }
    
    if (this.teamB.team.miniShield) {
      this.teamBShield = this.teamB.team.miniShield;
    }

    this.store.dispatch(
      GetTeamsMembersCommand({
        teamId: this.match.teamAId!,
      })
    );
    this.store.dispatch(
      GetTeamsMembersCommand({
        teamId: this.match.teamBId!,
      })
    );

    this.store.dispatch(
      GetTeamByIdCommand({
        teamId: this.match.teamAId!,
      })
    );
    this.store.dispatch(
      GetTeamByIdCommand({
        teamId: this.match.teamBId!,
      })
    );

    this.store.select(selectTeamWithMembersById(this.match.teamAId)).subscribe((team) => {
      this.teamA = {
        team: team.team,
        members: Object.values(team.members),
      };
    });
    if (this.match.locationId) {
      this.store.dispatch(
        GetLocationByIdCommand({
          locationId: this.match.locationId!,
        })
      );
      this.$location = this.store.select(
        selectLocationById(this.match.locationId)
      );
    }
    this.store.select(selectTeamWithMembersById(this.match.teamBId)).subscribe((team) => {
      this.teamB = {
        team: team.team,
        members: Object.values(team.members),
      };
    });
    this.playersForm = {
      teamA: [],
      teamB: [],
    };

    if (this.match.captainASignature) {
      this.signatureAPrev = this.match.captainASignature;
    }

    if (this.match.captainBSignature) {
      this.signatureBPrev = this.match.captainBSignature;
    }

    if (this.match.judgeSignature) {
      this.judgeSignaturePrev = this.match.judgeSignature;
    }

    this.playersForm = this.match.playerForm || this.playersForm;

    this.stadistics = this.match.stadistics || this.stadistics;

    this.extraGolesA =
      this.stadistics.extraGoalsTeamA?.goals || this.extraGolesA;
    this.extraGolesDescriptionA =
      this.stadistics.extraGoalsTeamA?.description ||
      this.extraGolesDescriptionA;
    this.extraGolesDescriptionB =
      this.stadistics.extraGoalsTeamB?.description ||
      this.extraGolesDescriptionB;

    this.extraGolesB =
      this.stadistics.extraGoalsTeamB?.goals || this.extraGolesB;

    this.extraDataToogleA = !!this.extraGolesA;
    this.extraDataToogleB = !!this.extraGolesB;

    this.observations = this.match.observations;
    this.date = this.match.date ? new Date(this.match.date) : undefined;

    this.status = this.match.status;
    this.selectedLocation = this.match.locationId;
    this.selectedPlayground = this.match.playground;

    this.totalizeCards();


    this.formGroup = this.fb.group({
      date: { disabled: true, value: this.date },
      hour: { disabled: true, value: this.getHour(this.date) },
      location: { disabled: true, value: this.match.locationId || '' },
      status: { disabled: true, value: this.match.status },
    });

    if (this.locationSelect) {
      this.locationSelect.value = this.match.locationId;
    }

    if (this.locationSelect) {
      this.locationSelect.value = this.match.locationId;
    }

    this.formGroup.get('location')?.setValue(this.match.locationId);
  }

  totalizeCards() {
    const stadistics = this.stadistics;
    if (stadistics) {
      if (stadistics.teamA) {

        this.yellowCardsTeamA = stadistics.teamA
          .map((x) => {
            return x.totalYellowCards || 0;
          })
          .reduce((prev, acc) => {
            return acc + prev;
          }, 0);
        this.redCardsTeamA = stadistics.teamA
          .map((x) => {
            return x.totalRedCards || 0;
          })
          .reduce((prev, acc) => {
            return acc + prev;
          }, 0);
      }
      if (stadistics.teamB) {
        this.yellowCardsTeamB = stadistics.teamB
          .map((x) => {
            return x.totalYellowCards || 0;
          })
          .reduce((prev, acc) => {
            return acc + prev;
          }, 0);
        this.redCardsTeamB = stadistics.teamB
          .map((x) => {
            return x.totalRedCards || 0;
          })
          .reduce((prev, acc) => {
            return acc + prev;
          }, 0);
      }
    }
  }
}
