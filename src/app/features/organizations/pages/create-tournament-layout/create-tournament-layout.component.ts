import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Id, TeamEntity } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  getTransactionIdentifier,
  admingPopUpInComponent
} from 'src/app/core/helpers/general.helpers';
import { CreateTournamentLayoutCommand } from '../../organizations.commands';
import { TransactionDeletedEvent } from '../../organizations.events';
import {
  selectTransactionById
} from '../../organizations.selector';
import { CATEGORIES } from 'src/app/app.constants';

@Component({
  selector: 'app-create-tournament-layout',
  templateUrl: './create-tournament-layout.component.html',
  styleUrls: ['./create-tournament-layout.component.scss'],
})
export class CreateTournamentLayoutComponent implements OnInit, OnDestroy {
  static route = 'create-tournament-layout';

  categories = CATEGORIES;
  formGroup;

  texts: string[] = [];
  sending = false;
  organizationId!: Id;
  selectTransactionByIdSubscription!: Subscription;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      edition: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      editions: new FormControl([] as string[]),
      flayer: new FormControl(),
      categories: new FormControl(),
    });
  }

  ngOnInit(): void {
    const teams: TeamEntity[] = [];
    this.activatedRoute.params.subscribe((value) => {
      this.organizationId = value.organizationId;
    });
  }

  addText() {
    const newText = this.formGroup.get('edition')?.value;
    if (newText != '' && newText != null) {
      const index = this.texts.indexOf(newText);
      if (index == -1) {
        this.texts.push(newText);
        this.formGroup.get('editions')?.setValue([...this.texts]);
      }
      this.formGroup.get('edition')?.setValue('');
    }
  }
  deleteTag(text: string) {
    const index = this.texts.indexOf(text);
    if (index >= 0) {
      this.texts.splice(index, 1);
      this.formGroup.get('editions')?.setValue([...this.texts]);
    }
  }

  onSelectedFile($event: any) {
    this.formGroup.get('flayer')?.setValue($event.url);
  }

  async create() {
    const value = this.formGroup.value;
    if (this.formGroup.valid) {

      const validations = {
        maxWidth: 400,
        maxHeight: 400,
        mustBeTransparent: false,
        maxAspectRatio: 1.3,
      };
      const tournamentLayout: TournamentLayoutEntity = {
        categories: value.categories,
        description: value.description!,
        name: value.name!,
        organizationId: this.organizationId,
        editions: value.editions!,
        flayer: value.flayer,
      };

      const transactionId = getTransactionIdentifier(tournamentLayout);

      this.sending = true;
      this.store.dispatch(
        CreateTournamentLayoutCommand({
          tournamentLayout,
          transactionId,
        })
      );
      const extraData = {
        width: validations.maxWidth,
        height: validations.maxHeight,
      };

      const onCloseAction = () => {
        this.sending = false;
      };
      const onSuccessAction = () => {
        this.formGroup.reset();
      };
      this.selectTransactionByIdSubscription = admingPopUpInComponent({
        dialog: this.dialog,
        extraData,
        onCloseDialogAction: onCloseAction,
        selectTransactionById,
        onSuccessAction,
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
