import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Id, RegisteredTeamStatus, TeamEntity } from '@deporty-org/entities';
import {
  DEFAULT_STADISTICS_ORDER,
  DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION,
  FixtureStagesConfiguration,
  StadistisKind,
  TieBreakingOrder,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { RequiredDocConfig } from '@deporty-org/entities/organizations';

import {
  DEFAULT_SCHEMAS_CONFIGURATION,
  FixtureStageConfiguration,
  TournamentLayoutSchema,
} from '@deporty-org/entities/organizations/tournament-layout.entity';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  CATEGORIES,
  GROUP_SIZES_PLACEHOLDERS,
  REGISTERED_TEAM_STATUS_CODES,
} from 'src/app/app.constants';
import {
  admingPopUpInComponent,
  generateRandomString,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import {
  EditTournamentLayoutCommand,
  GetTournamentLayoutByIdCommand,
  ValidateSchemaCommand,
} from '../../organizations.commands';
import { TransactionDeletedEvent } from '../../organizations.events';
import {
  selectSchemaStatus,
  selectTournamentLayoutById,
  selectTransactionById,
} from '../../organizations.selector';

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
export class EditTournamentLayoutComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static route = 'edit-tournament-layout';

  $flayerSubscription!: Subscription;
  categories = CATEGORIES;
  schemaFormGroups!: { name: string; forms: FormGroup[] }[];
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
  groupSizesPlaceholders = GROUP_SIZES_PLACEHOLDERS;
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
  schemaConfig: TournamentLayoutSchema[] | undefined;
  currentSchemaForm!: { name: string; forms: FormGroup[] } | undefined;
  currentGroupConfig!: number[];
  @ViewChild('select', { static: false }) select!: MatSelect;
  $schemaValid: any;
  requiredDocs?: RequiredDocConfig[];

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  ngAfterViewInit(): void {}

  addFixtureStageClasificationConfig(
    index: number,
    currentSchemaForm: { name: string; forms: FormGroup[] }
  ) {
    const form = new FormGroup({
      groupCount: new FormControl<number>(2, Validators.required),
      groupSize: new FormControl<number[]>([4, 4], Validators.required),
      passedTeamsCount: new FormControl<number[]>([2, 2], Validators.required),
      generatedMatches: new FormControl<number>(4),
    });

    form.get('passedTeamsCount')?.valueChanges.subscribe((value) => {
      console.log(value);

      this.onFixtureStageConfigurationChanged(form, value);
    });
    currentSchemaForm.forms.splice(index + 1, 0, form);

    this.currentGroupConfig = [
      ...currentSchemaForm.forms,
    ].pop()?.value.passedTeamsCount;
  }

  deleteFixtureStageClasificationConfig(
    index: number,
    currentSchemaForm: { name: string; forms: FormGroup[] }
  ) {
    currentSchemaForm.forms.splice(index, 1);
  }

  onFixtureStageConfigurationChanged(form: FormGroup, value: any) {
    form.get('generatedMatches')?.setValue(
      form
        .get('passedTeamsCount')
        ?.value.reduce((acc: number, curr: number) => {
          return acc + curr;
        })
    );
    if (this.currentSchemaForm) {
      const last = [...this.currentSchemaForm?.forms].pop();

      const clasificationFormGroupsValue = {
        name: this.currentSchemaForm['name'],
        stages: this.currentSchemaForm['forms'].map((x) => x.value),
      };

      this.store.dispatch(
        ValidateSchemaCommand({
          schema: clasificationFormGroupsValue,
        })
      );
    }
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

  deleteTag(text: string) {
    const index = this.texts.indexOf(text);
    if (index >= 0) {
      this.texts.splice(index, 1);
      this.generalDataFormGroup.get('editions')?.setValue([...this.texts]);
    }
  }

  async edit() {
    const generalDataFormGroupValue = this.generalDataFormGroup.value;
    const clasificationFormGroupsValue = this.schemaFormGroups.map((x) => {
      return {
        name: x.name,
        stages: x.forms.map((x) => x.value),
      };
    });
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
        schemas: clasificationFormGroupsValue,
        tieBreakingOrder: this.currentTieBreakingOrderValues,
      };

      const tournamentLayout: TournamentLayoutEntity = {
        categories: generalDataFormGroupValue.categories,
        description: generalDataFormGroupValue.description!,
        allowAutoInscriptionFromTeamModifications: generalDataFormGroupValue.allowAutoInscriptionFromTeamModifications,
        name: generalDataFormGroupValue.name!,
        organizationId: this.organizationId,
        editions: generalDataFormGroupValue.editions!,
        flayer: generalDataFormGroupValue.flayer,
        registeredTeamsVisibleStatus:
          generalDataFormGroupValue.registeredTeamsVisibleStatus,
        fixtureStagesConfiguration,
        id: this.tournamentLayoutId,
        requiredDocsConfig: this.requiredDocs,
      };

      console.log('Par enviar ');
      console.log(tournamentLayout);

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
      this.$schemaValid = this.store.select(selectSchemaStatus);

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
            console.log('Tournament Layout ', tournamentLayout);

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
              allowAutoInscriptionFromTeamModifications: new FormControl(
                tournamentLayout.allowAutoInscriptionFromTeamModifications ||
                  false
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
            const schemaFormGroups = [];
            this.schemaConfig =
              tournamentLayout.fixtureStagesConfiguration?.schemas;
            if (
              !this.schemaConfig ||
              (this.schemaConfig && this.schemaConfig.length == 0)
            ) {
              this.schemaConfig = DEFAULT_SCHEMAS_CONFIGURATION;
            }

            const first = this.schemaConfig[0];

            for (const schema of this.schemaConfig) {
              const forms: FormGroup<{
                groupCount: FormControl<number | null>;
                groupSize: FormControl<number[] | null>;
                passedTeamsCount: FormControl<number[] | null>;
                generatedMatches: FormControl<number | null>;
              }>[] = schema.stages.map((stage: FixtureStageConfiguration) => {
                const t = new FormGroup({
                  groupCount: new FormControl<number>(
                    stage.groupCount,
                    Validators.required
                  ),
                  groupSize: new FormControl<number[]>(
                    stage.groupSize,
                    Validators.required
                  ),
                  passedTeamsCount: new FormControl<number[]>(
                    stage.passedTeamsCount,
                    Validators.required
                  ),
                  generatedMatches: new FormControl<number>(
                    stage.passedTeamsCount
                      ? stage.passedTeamsCount.reduce((acc, curr) => {
                          return acc + curr;
                        })
                      : 0,
                    Validators.required
                  ),
                });

                t.get('passedTeamsCount')?.valueChanges.subscribe(
                  (valueChanges) => {
                    this.onFixtureStageConfigurationChanged(t, valueChanges);
                  }
                );
                t.valueChanges.subscribe((valueChanges) => {
                  if (this.currentSchemaForm) {
                    this.currentGroupConfig = [
                      ...this.currentSchemaForm.forms,
                    ].pop()?.value.passedTeamsCount;
                    this.cd.detectChanges();
                  }
                });
                return t;
              });

              schemaFormGroups.push({
                name: schema.name,
                forms,
              });
            }

            this.schemaFormGroups = schemaFormGroups;
            this.currentSchemaForm = this.schemaFormGroups
              ?.filter((schema) => schema.name == first.name)
              .pop();

            if (this.currentSchemaForm) {
              this.currentGroupConfig = [
                ...this.currentSchemaForm.forms,
              ].pop()?.value.passedTeamsCount;
            }

            setTimeout(() => {
              this.select.value = this.currentSchemaForm?.name;
              console.log('Toene');
            }, 100);
          }
        });
    });
  }

  changeCurrentSchema(event: MatSelectChange) {
    this.currentSchemaForm = this.schemaFormGroups
      ?.filter((schema) => schema.name == event.value)
      .pop();
  }
  onChangeStadisticsOrder(items: any) {
    const order = items.map((item: any) => item.value);
    this.currentStadisticsgOrderValues = order;
  }

  onChangeRequiredDocsConfiguration(data: RequiredDocConfig[]) {
    this.requiredDocs = data.map((x) => {
      return { ...x, identifier: generateRandomString(20) };
    });
    console.log(this.requiredDocs);
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
