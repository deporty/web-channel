import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Id, TeamEntity, TournamentEntity } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TOURNAMENT_STATUS_CODES } from 'src/app/app.constants';
import { ModalComponent } from 'src/app/core/presentation/components/modal/modal.component';
import {
  CreateTournamentCommand,
  GetTournamentLayoutsByOrganizationIdCommand,
} from '../../organizations.commands';
import {
  selectOrganizationById,
  selectTournamentCreatedFlag,
  selectTournamentLayoutsByOrganizationId,
  selectTransactionById,
} from '../../organizations.selector';
import {
  getTransactionIdentifier,
  admingPopUpInComponent,
} from 'src/app/core/helpers/general.helpers';
import { TransactionDeletedEvent } from '../../organizations.events';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.scss'],
})
export class CreateTournamentComponent implements OnInit, OnDestroy {
  static route = 'create-tournament';

  statusList = TOURNAMENT_STATUS_CODES;
  formGroup;

  texts: string[] = [];

  minDate = new Date(2022, 0, 1);
  $organization: any;
  $tournamentLayouts: any;
  $currentLayout!: Observable<TournamentLayoutEntity>;
  newFile = false;
  organizationId!: Id;
  sending = false;
  selectTransactionByIdSubscription!: Subscription;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.formGroup = new FormGroup({
      layout: new FormControl(),
      schema: new FormControl(),
      edition: new FormControl(),
      flayer: new FormControl(),
      category: new FormControl(),
      startDate: new FormControl(new Date(), [Validators.required]),
      status: new FormControl(),
      numOfInvoices: new FormControl(1),
      organizationId: new FormControl(),
      version: new FormControl(),
      year: new FormControl(new Date().getFullYear(), [Validators.required]),
    });
  }

  ngOnInit(): void {
    const teams: TeamEntity[] = [];

    this.activatedRoute.params.subscribe((value) => {
      this.organizationId = value.organizationId;
      this.store.dispatch(
        GetTournamentLayoutsByOrganizationIdCommand({
          organizationId: this.organizationId,
        })
      );
      this.formGroup.get('organizationId')?.setValue(this.organizationId);

      this.$tournamentLayouts = this.store.select(
        selectTournamentLayoutsByOrganizationId(this.organizationId)
      );
      this.$organization = this.store.select(
        selectOrganizationById(this.organizationId)
      );
      // this.$organization.subscribe((value: OrganizationEntity | undefined) => {
      //   if (value) {
      //   }
      // });
    });
  }

  selectionChange(layout: MatSelectChange) {
    const id = layout.value;
    this.$currentLayout = this.$tournamentLayouts.pipe(
      map((tournamentLayouts: TournamentLayoutEntity[]) => {
        return tournamentLayouts.filter((x) => x.id === id).pop();
      }),
      tap((tournamentLayout: TournamentLayoutEntity) => {
        this.formGroup.get('flayer')?.setValue(tournamentLayout.flayer);
      })
    );
  }
  schemaSelectionChange(change: MatSelectChange) {
    const schema = change.value;

    this.formGroup.get('schema')?.setValue(schema);
  }

  onSelectedFile($event: any) {
    this.formGroup.get('flayer')?.setValue($event.url);
    this.newFile = true;
  }
  createTournament() {
    const value = this.formGroup.value;
    if (this.formGroup.valid) {
      const tournament: TournamentEntity = {
        category: value.category,
        edition: value.edition,
        schema: value.schema,
        locations: [],
        financialStatements: {
          ammount: 0,
          numOfInvoices: value.numOfInvoices ?? 0,
          status: 'pending',
        },
        year: value.year ?? new Date().getFullYear(),
        version: value.version,
        organizationId: value.organizationId,
        startsDate: value.startDate!,
        status: value.status,
        tournamentLayoutId: value.layout,
        flayer: this.newFile ? value.flayer : undefined,
      };

      const transactionId = getTransactionIdentifier(tournament);

      this.sending = true;

      this.store.dispatch(
        CreateTournamentCommand({
          tournament,
          transactionId,
        })
      );

      const validations = {
        maxWidth: 400,
        maxHeight: 400,
        mustBeTransparent: false,
        maxAspectRatio: 1.3,
      };

      const extraData = {
        width: validations.maxWidth,
        height: validations.maxHeight,
      };

      const onCloseDialogAction = () => {
        this.sending = false;
      };
      const onSuccessAction = () => {
        this.newFile = false;
        this.formGroup.reset({
          organizationId: this.formGroup.get('organizationId')?.value,
        });
      };

      this.selectTransactionByIdSubscription = admingPopUpInComponent({
        dialog: this.dialog,
        extraData,
        onCloseDialogAction,
        onSuccessAction,
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
  }
}
