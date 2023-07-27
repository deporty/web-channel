import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Id, TeamEntity } from '@deporty-org/entities';
import {
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

export const TieBreakingOrderMap = [
  {
    value: 'GA',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsAgainst',
    display: 'Goles en contra',
  },
  {
    value: 'GAPM',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsAgainstPerMatch',
    display: 'Goles en contra por partido',
  },
  {
    value: 'GD',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsDifference',
    display: 'Goles diferencia',
  },
  {
    value: 'GIF',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsInFavor',
    display: 'Goles a favor',
  },
  {
    value: 'FP',
    operator: (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0),
    property: 'fairPlay',
    display: 'Juego Limpio',
  },
  {
    value: 'LM',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'lostMatches',
    display: 'Partidos perdidos',
  },
  {
    value: 'PM',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'playedMatches',
    display: 'Partidos Jugados',
  },
  {
    value: 'P',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'points',
    display: 'Puntos',
  },
  {
    value: 'TM',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'tiedMatches',
    display: 'Partidos empatados',
  },
  {
    value: 'WM',
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'wonMatches',
    display: 'Partidos ganados',
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
  currentStadisticsgOrder!: {
    display: string;
    value: string;
    decoration: boolean;
  }[];
  currentStadisticsgOrderValues!: StadistisKind[];
  currentTieBreakingOrder!: {
    value: string;
    operator: (a: number, b: number) => 1 | -1 | 0;
    property: string;
    display: string;
    decoration: boolean;
  }[];
  currentTieBreakingOrderValues!: TieBreakingOrder[];
  currentTournamentLayout!: TournamentLayoutEntity;
  generalDataFormGroup!: FormGroup;
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

  addNewTiebreakingItem(item: any) {
    console.log('Entrando ', item);
    const exist = this.currentTieBreakingOrder.includes(item);
    if (!exist) {
      this.currentTieBreakingOrder = [...this.currentTieBreakingOrder, item];
      const order = this.currentTieBreakingOrder.map((item: any) => item.value);

      this.currentStadisticsgOrderValues = order;
      const index = this.noSettedTieBreakingOrder.indexOf(item);
      console.log('EL index es ');

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

  deleteTag(text: string) {
    const index = this.texts.indexOf(text);
    if (index >= 0) {
      this.texts.splice(index, 1);
      this.generalDataFormGroup.get('editions')?.setValue([...this.texts]);
    }
  }

  async edit() {
    const generalDataFormGroupValue = this.generalDataFormGroup.value;
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
        stages: [],
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
      const onErrorAction = () => {};
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
                tournamentLayout.registeredTeamsVisibleStatus
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
      operator: (a: number, b: number) => 1 | -1 | 0;
      property: string;
      display: string;
      decoration: boolean;
    }[] = [];
    const noSetted: {
      value: string;
      operator: (a: number, b: number) => 1 | -1 | 0;
      property: string;
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
      operator: (a: number, b: number) => 1 | -1 | 0;
      property: string;
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
