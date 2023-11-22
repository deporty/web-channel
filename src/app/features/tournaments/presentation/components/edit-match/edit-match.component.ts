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
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import {
  LocationEntity,
  PlaygroundEntity,
} from '@deporty-org/entities/locations';
import { IPlayerModel } from '@deporty-org/entities/players';
import {
  MatchEntity,
  PlayerForm,
  Stadistics,
  GOAL_KINDS,
  MATCH_STATUS,
} from '@deporty-org/entities/tournaments';
import { Base64ModalComponent } from 'src/app/core/presentation/components/base64-modal/base64-modal.component';
import { PadComponent } from 'src/app/core/presentation/components/pad/pad.component';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';
import {
  Id,
  MemberEntity,
  TeamEntity,
  UserEntity,
} from '@deporty-org/entities';
import { MatDatepicker } from '@angular/material/datepicker';
import { DEFAULT_SHIELD_IMG } from 'src/app/app.constants';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.scss'],
})
export class EditMatchComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input('match') _match!: MatchEntity;
  @ViewChild('captainA', { static: false }) captainPadA!: PadComponent;
  @ViewChild('captainB', { static: false }) captainPadB!: PadComponent;
  date: Date | undefined;
  @ViewChild(MatDatepicker, { static: false }) datePicker!: MatDatepicker<any>;
  dialogNoMebers!: MatDialogRef<any> | null;
  extraDataToogleA!: boolean;
  extraDataToogleB!: boolean;
  extraGolesA!: number;
  extraGolesB!: number;
  extraGolesDescriptionA!: string;
  extraGolesDescriptionB!: string;
  formGroup!: UntypedFormGroup;
  goalKind = GOAL_KINDS;
  groupIndex!: number;
  groupLabel: any;
  @ViewChild('judge', { static: false }) judge!: PadComponent;
  judgeSignaturePrev!: string;
  @ViewChild('locationSelect', { static: false }) locationSelect!: MatSelect;
  @Input() locations!: LocationEntity[];
  match!: MatchEntity;
  matchStatus = Object.entries(MATCH_STATUS);
  @Input() meta: any = {};
  minute!: number;
  minuteCard!: number;
  observations!: string | undefined;
  @Output('on-save') onSave: EventEmitter<any>;
  playersA!: IPlayerModel[];
  playersB!: IPlayerModel[];
  playersForm!: PlayerForm;
  @ViewChild('playgroundSelect', { static: false })
  playgroundSelect!: MatSelect;
  playgrounds!: Array<PlaygroundEntity>;
  redCardsTeamA: number;
  redCardsTeamB: number;
  redMinuteCard!: number;
  @ViewChild('refereeSelect', { static: false }) refereeSelect!: MatSelect;
  @Input() referees!: UserEntity[];
  selectedKindGoal!: string;
  selectedLocation!: Id | undefined;
  selectedPlayground!: PlaygroundEntity | undefined;
  selectedReferee!: Id | undefined;
  signatureAPrev!: string;
  signatureBPrev!: string;
  stadistics!: Stadistics;
  stageId!: string;
  status: string;
  @Input('team-a') teamA!: TeamEntity;
  @Input('team-a-members') teamAMembers!: Array<MemberEntity>;
  teamAShield: string;
  @Input('team-b') teamB!: TeamEntity;
  @Input('team-b-members') teamBMembers!: Array<MemberEntity>;
  teamBShield: string;
  tournamentId!: string;
  yellowCardsTeamA: number;
  yellowCardsTeamB: number;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private tournamentAdapter: TournamentAdapter,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private externalResourcePipe: ExternalResourcePipe
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

  downloadSheet() {
    this.tournamentAdapter
      .downloadMatchSheet(this.meta.tournamentId, this.match)
      .subscribe((x) => {
        const data = x.data;
        if (data) {
          this.dialog.open(Base64ModalComponent, {
            data: {
              base64: data,
            },
            width: '80%',
            height: '70%',
          });
        }
      });
  }

  getDate(date?: Date) {
    return date
      ? `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
      : '';
  }

  getHour(date?: Date) {
    return date ? `${date.getHours()}:${date.getMinutes()}` : '12:00';
  }

  getObjectKeys(obj: any) {
    return Object.entries(obj);
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.match = JSON.parse(JSON.stringify(this._match));

    if (this.teamA.miniShield) {
      this.teamAShield = this.externalResourcePipe.transform(
        this.teamA.miniShield
      );
    }

    if (this.teamB.miniShield) {
      this.teamBShield = this.externalResourcePipe.transform(
        this.teamB.miniShield
      );
    }

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

    this.selectedReferee = this.match.refereeIds
      ? this.match.refereeIds[0].refereeId
      : undefined;

    this.selectedPlayground = this.match.playground;

    this.totalizeCards();

    this.formGroup = new UntypedFormGroup({
      date: new UntypedFormControl(this.date),
      phase: new UntypedFormControl(this.match.phase),
      hour: new UntypedFormControl(this.getHour(this.date)),
      location: new UntypedFormControl(this.match.locationId || ''),
      playground: new UntypedFormControl(this.match.playground?.name || ''),
      status: new UntypedFormControl(this.match.status),
      referee: new UntypedFormControl(this.selectedReferee || ''),
    });

    this.formGroup.valueChanges.subscribe((value) => {
      if (value.location) {
        const currentLocation: LocationEntity = this.locations
          .filter((x) => x.id === value.location)
          .pop()!;
        this.selectedLocation = value.location;

        if (currentLocation) {
          this.playgrounds = currentLocation.playgrounds;
        }
      }
      if (value.referee) {
        this.selectedReferee = value.referee;
      }
      if (value.playground) {
        this.selectedPlayground = { name: value.playground };
      }
    });

    if (this.locationSelect) {
      this.locationSelect.value = this.match.locationId;
    }
    if (this.playgroundSelect) {
      this.playgroundSelect.value = this.match.playground?.name;
    }
    if (this.refereeSelect) {
      this.refereeSelect.value = this.selectedReferee;
    }

    this.formGroup.get('location')?.setValue(this.match.locationId);
    this.formGroup.get('referee')?.setValue(this.selectedReferee);
    this.formGroup.get('playground')?.setValue(this.match.playground?.name);
  }

  onInput() {
    this.datePicker.open();
  }

  saveData() {
    this.status = 'pending';
    const date: Date = this.formGroup.get('date')?.value;

    let hourWithMinute: string = this.formGroup.get('hour')?.value;

    if (!hourWithMinute) {
      hourWithMinute = '12:00';
    }
    const hour = hourWithMinute.split(':')[0];
    const minute = hourWithMinute.split(':')[1];

    const captainABase64 = this.captainPadA.getImage();
    const captainBBase64 = this.captainPadB.getImage();
    const judgeBase64 = this.judge.getImage();

    const location = this.selectedLocation;
    const referee = this.selectedReferee;
    const playground = this.selectedPlayground || this.match.playground;
    date?.setHours(parseInt(hour), parseInt(minute));

    Promise.all([captainABase64, captainBBase64, judgeBase64]).then(
      (values) => {
        this.onSave.emit({
          meta: this.meta,
          match: {
            ...this.match,
            phase: this.formGroup.get('phase')?.value,
            date: !!date ? date.getTime() / 1000 : undefined,
            status: this.formGroup.get('status')?.value,
            stadistics: {
              ...this.stadistics,
              extraGoalsTeamA: {
                goals: this.extraGolesA || 0,
                description: this.extraGolesDescriptionA,
              },
              extraGoalsTeamB: {
                goals: this.extraGolesB || 0,
                description: this.extraGolesDescriptionB,
              },
            },
            playerForm: this.playersForm,
            observations: this.observations,
            locationId: location,
            refereeIds: referee
              ? [
                  {
                    refereeId: referee,
                    rol: 'main',
                  },
                ]
              : undefined,
            playground,
            captainASignature: values[0],
            captainBSignature: values[1],
            judgeSignature: values[2],
          },
        });
      }
    );
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

  updateTeamA(event: any) {
    this.playersForm['teamA'] = event['playersForm'];
    this.stadistics['teamA'] = event['stadistics'];
    this.calculateGoals();
    this.totalizeCards();
  }

  updateTeamB(event: any) {
    this.playersForm['teamB'] = event['playersForm'];
    this.stadistics['teamB'] = event['stadistics'];
    this.totalizeCards();
    this.calculateGoals();
  }
}
