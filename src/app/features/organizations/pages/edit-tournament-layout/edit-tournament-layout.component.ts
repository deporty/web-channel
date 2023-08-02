import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Id, RegisteredTeamStatus, TeamEntity } from '@deporty-org/entities';
import {
  DEFAULT_FIXTURE_STAGES_CONFIGURATION,
  DEFAULT_STADISTICS_ORDER,
  DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION,
  FixtureStagesConfiguration,
  StadistisKind,
  TieBreakingOrder,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  CATEGORIES,
  REGISTERED_TEAM_STATUS_CODES,
} from 'src/app/app.constants';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import {
  EditTournamentLayoutCommand,
  GetTournamentLayoutByIdCommand,
} from '../../organizations.commands';
import { TransactionDeletedEvent } from '../../organizations.events';
import {
  selectTournamentLayoutById,
  selectTransactionById,
} from '../../organizations.selector';
import {
  DEFAULT_FIXTURE_STAGE_CONFIGURATION,
  FixtureStageConfiguration,
} from '@deporty-org/entities/organizations/tournament-layout.entity';

export const TieBreakingOrderMap = [
  {
    value: 'GA',
    display: 'Goles en contra',
  },
  {
    value: 'GAPM',
    display: 'Goles en contra por partido',
  },
  {
    value: 'GD',
    display: 'Goles diferencia',
  },
  {
    value: 'GIF',
    display: 'Goles a favor',
  },
  {
    value: 'FP',
    display: 'Juego Limpio',
  },
  {
    value: 'LM',
    display: 'Partidos perdidos',
  },
  {
    value: 'PM',
    display: 'Partidos Jugados',
  },
  {
    value: 'P',
    display: 'Puntos',
  },
  {
    value: 'TM',
    display: 'Partidos empatados',
  },
  {
    value: 'WM',
    display: 'Partidos ganados',
  },
  {
    value: 'WB2',
    display: 'Ganador entre dos',
  },
];

@Component({
  selector: 'app-edit-tournament-layout',
  templateUrl: './edit-tournament-layout.component.html',
  styleUrls: ['./edit-tournament-layout.component.scss'],
})
export class EditTournamentLayoutComponent implements OnInit, OnDestroy {
  static route = 'edit-tournament-layout';

  $flayerSubscription!: Subscription;
  categories = CATEGORIES;
  clasificationFormGroups!: FormGroup[];
  currentStadisticsgOrder!: {
    display: string;
    value: string;
    decoration: boolean;
  }[];
  currentStadisticsgOrderValues!: StadistisKind[];
  currentTieBreakingOrder!: {
    value: string;
    display: string;
    decoration: boolean;
  }[];
  currentTieBreakingOrderValues!: TieBreakingOrder[];
  currentTournamentLayout!: TournamentLayoutEntity;
  generalDataFormGroup!: FormGroup;
  groupSizesPlaceholders = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  negativePointsPerCardFormGroup!: FormGroup;
  noSettedTieBreakingOrder!: {
    display: string;
    value: string;
    decoration: boolean;
  }[];
  organizationId!: Id;
  pointsConfigurationFormGroup!: FormGroup;
  registeredTeamStatusCodes = REGISTERED_TEAM_STATUS_CODES;
  selectTransactionByIdSubscription!: Subscription;
  sending = false;
  texts: string[] = [];
  tournamentLayoutId!: Id;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {}

  addFixtureStageClasificationConfig(index: number) {
    this.clasificationFormGroups.splice(
      index + 1,
      0,
      new FormGroup({
        groupCount: new FormControl<number>(2, Validators.required),
        groupSize: new FormControl<number[]>([4, 4], Validators.required),
        passedTeamsCount: new FormControl<number[]>(
          [2, 2],
          Validators.required
        ),
      })
    );
  }

  addNewTiebreakingItem(item: any) {
    const exist = this.currentTieBreakingOrder.includes(item);
    if (!exist) {
      this.currentTieBreakingOrder = [...this.currentTieBreakingOrder, item];
      const order = this.currentTieBreakingOrder.map((item: any) => item.value);

      this.currentTieBreakingOrderValues = order;
      const index = this.noSettedTieBreakingOrder.indexOf(item);

      this.noSettedTieBreakingOrder.splice(index, 1);
    }
  }

  addText() {
    const newText = this.generalDataFormGroup.get('edition')?.value;
    if (newText != '' && newText != null) {
      const index = this.texts.indexOf(newText);
      if (index == -1) {
        this.texts.push(newText);
        this.generalDataFormGroup.get('editions')?.setValue([...this.texts]);
      }
      this.generalDataFormGroup.get('edition')?.setValue('');
    }
  }

  deleteFixtureStageClasificationConfig(index: number) {
    this.clasificationFormGroups.splice(index, 1);
  }

  deleteTag(text: string) {
    const index = this.texts.indexOf(text);
    if (index >= 0) {
      this.texts.splice(index, 1);
      this.generalDataFormGroup.get('editions')?.setValue([...this.texts]);
    }
  }

  async edit() {
    const generalDataFormGroupValue = this.generalDataFormGroup.value;
    const clasificationFormGroupsValue = this.clasificationFormGroups.map(
      (x) => x.value
    );
    const negativePointsPerCardFormGroupValue =
      this.negativePointsPerCardFormGroup.value;
    const pointsConfigurationFormGroupValue =
      this.pointsConfigurationFormGroup.value;

    if (
      this.generalDataFormGroup.valid &&
      this.negativePointsPerCardFormGroup.valid
    ) {
      const fixtureStagesConfiguration: FixtureStagesConfiguration = {
        negativePointsPerCard: {
          yellowCardsNegativePoints: parseFloat(
            negativePointsPerCardFormGroupValue.yellowCardsNegativePoints
          ),
          redCardsNegativePoints: parseFloat(
            negativePointsPerCardFormGroupValue.redCardsNegativePoints
          ),
        },
        pointsConfiguration: {
          lostMatchPoints: parseFloat(
            pointsConfigurationFormGroupValue.lostMatchPoints
          ),
          tieMatchPoints: parseFloat(
            pointsConfigurationFormGroupValue.tieMatchPoints
          ),
          wonMatchPoints: parseFloat(
            pointsConfigurationFormGroupValue.wonMatchPoints
          ),
        },
        stadisticsOrder: this.currentStadisticsgOrderValues,
        stages: clasificationFormGroupsValue,
        tieBreakingOrder: this.currentTieBreakingOrderValues,
      };

      const tournamentLayout: TournamentLayoutEntity = {
        categories: generalDataFormGroupValue.categories,
        description: generalDataFormGroupValue.description!,
        name: generalDataFormGroupValue.name!,
        organizationId: this.organizationId,
        editions: generalDataFormGroupValue.editions!,
        flayer: generalDataFormGroupValue.flayer,
        registeredTeamsVisibleStatus:
          generalDataFormGroupValue.registeredTeamsVisibleStatus,
        fixtureStagesConfiguration,
        id: this.tournamentLayoutId,
      };

      const transactionId = getTransactionIdentifier(tournamentLayout);

      this.sending = true;
      this.store.dispatch(
        EditTournamentLayoutCommand({
          tournamentLayout,
          transactionId,
        })
      );

      const onCloseAction = () => {
        this.sending = false;
      };
      const onErrorAction = (dialogLoading: MatDialogRef<any>) => {
        dialogLoading.close();
      };
      this.selectTransactionByIdSubscription = admingPopUpInComponent({
        dialog: this.dialog,
        onCloseDialogAction: onCloseAction,
        onErrorAction,
        selectTransactionById,
        store: this.store,
        TransactionDeletedEvent,
        transactionId,
        translateService: this.translateService,
      });
    }
  }

  ngOnDestroy(): void {
    this.selectTransactionByIdSubscription?.unsubscribe();
    this.$flayerSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const teams: TeamEntity[] = [];
    this.activatedRoute.params.subscribe((value) => {
      this.organizationId = value.organizationId;
      this.tournamentLayoutId = value.tournamentLayoutId;

      this.store.dispatch(
        GetTournamentLayoutByIdCommand({
          organizationId: this.organizationId,
          tournamentLayoutId: this.tournamentLayoutId,
        })
      );

      this.store
        .select(selectTournamentLayoutById(this.tournamentLayoutId))
        .subscribe((tournamentLayout: TournamentLayoutEntity | undefined) => {
          if (tournamentLayout) {
            this.organizeOrderTieBreaking(
              tournamentLayout.fixtureStagesConfiguration?.tieBreakingOrder
            );
            this.organizeStadisticsOrder(
              tournamentLayout.fixtureStagesConfiguration?.stadisticsOrder
            );

            this.currentTournamentLayout = tournamentLayout;

            this.generalDataFormGroup = new FormGroup({
              name: new FormControl(tournamentLayout.name, [
                Validators.required,
              ]),
              edition: new FormControl(''),
              description: new FormControl(tournamentLayout.description, [
                Validators.required,
              ]),
              editions: new FormControl(tournamentLayout.editions || []),
              tieBreakingOrder: new FormControl(
                tournamentLayout.fixtureStagesConfiguration?.tieBreakingOrder ||
                  DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION
              ),
              categories: new FormControl(tournamentLayout.categories),
              registeredTeamsVisibleStatus: new FormControl(
                tournamentLayout.registeredTeamsVisibleStatus ||
                  (['enabled'] as RegisteredTeamStatus[])
              ),
            });

            if (tournamentLayout.fixtureStagesConfiguration) {
              this.negativePointsPerCardFormGroup = new FormGroup({
                yellowCardsNegativePoints: new FormControl<number>(
                  tournamentLayout.fixtureStagesConfiguration.negativePointsPerCard.yellowCardsNegativePoints,
                  Validators.required
                ),
                redCardsNegativePoints: new FormControl<number>(
                  tournamentLayout.fixtureStagesConfiguration.negativePointsPerCard.redCardsNegativePoints,
                  Validators.required
                ),
              });

              this.pointsConfigurationFormGroup = new FormGroup({
                lostMatchPoints: new FormControl<number>(
                  tournamentLayout.fixtureStagesConfiguration.pointsConfiguration.lostMatchPoints,
                  Validators.required
                ),
                tieMatchPoints: new FormControl<number>(
                  tournamentLayout.fixtureStagesConfiguration.pointsConfiguration.tieMatchPoints,
                  Validators.required
                ),
                wonMatchPoints: new FormControl<number>(
                  tournamentLayout.fixtureStagesConfiguration.pointsConfiguration.wonMatchPoints,
                  Validators.required
                ),
              });
            }
            this.clasificationFormGroups = [];
            let clasificationConfig: FixtureStageConfiguration[] | undefined =
              tournamentLayout.fixtureStagesConfiguration?.stages;
            if (
              !clasificationConfig ||
              (clasificationConfig && clasificationConfig.length == 0)
            ) {
              clasificationConfig = DEFAULT_FIXTURE_STAGE_CONFIGURATION;
            }

            for (const stageConfig of clasificationConfig) {
              const form = new FormGroup({
                groupCount: new FormControl<number>(
                  stageConfig.groupCount,
                  Validators.required
                ),
                groupSize: new FormControl<number[]>(
                  stageConfig.groupSize,
                  Validators.required
                ),
                passedTeamsCount: new FormControl<number[]>(
                  stageConfig.passedTeamsCount,
                  Validators.required
                ),
              });

              this.clasificationFormGroups.push(form);
            }
          }
        });
    });
  }

  onChangeStadisticsOrder(items: any) {
    const order = items.map((item: any) => item.value);
    this.currentStadisticsgOrderValues = order;
  }

  onChangeTieBreakingOrder(items: any) {
    const order = items.map((item: any) => item.value);
    this.currentTieBreakingOrderValues = order;
  }

  onDeleteTieBreakingOrder(item: any) {
    const index = this.currentTieBreakingOrder.findIndex((t) => {
      return t.value == item.value;
    });
    this.currentTieBreakingOrder.splice(index, 1);
    this.noSettedTieBreakingOrder.push(item);
    const order = this.currentTieBreakingOrder.map((item: any) => item.value);
    this.currentTieBreakingOrderValues = order;
  }

  organizeOrderTieBreaking(currentOrder: TieBreakingOrder[] | undefined) {
    const order = currentOrder || DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION;
    const temp: {
      value: string;
      display: string;
      decoration: boolean;
    }[] = [];
    const noSetted: {
      value: string;
      display: string;
      decoration: boolean;
    }[] = [];

    for (const o of order) {
      const element = TieBreakingOrderMap.find((x) => {
        return x.value == o;
      });
      if (element) {
        temp.push({ ...element, decoration: false });
      }
    }

    for (const x of TieBreakingOrderMap) {
      const element = order.find((y) => y == x.value);
      if (!element) {
        noSetted.push({ ...x, decoration: true });
      }
    }

    this.currentTieBreakingOrder = [...temp];
    this.noSettedTieBreakingOrder = [...noSetted];
    this.onChangeTieBreakingOrder(this.currentTieBreakingOrder);
  }

  organizeStadisticsOrder(currentOrder: StadistisKind[] | undefined) {
    const order = currentOrder || DEFAULT_STADISTICS_ORDER;
    const temp: {
      value: string;
      display: string;
      decoration: boolean;
    }[] = [];

    for (const o of order) {
      const element = TieBreakingOrderMap.find((x) => {
        return x.value == o;
      });
      if (element) temp.push({ ...element, decoration: false });
    }

    this.currentStadisticsgOrder = [...temp];
    this.onChangeStadisticsOrder(this.currentStadisticsgOrder);
  }
}
