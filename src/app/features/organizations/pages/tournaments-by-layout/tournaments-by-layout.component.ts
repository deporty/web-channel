import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import {
  admingPopUpInComponent,
  getTransactionIdentifier,
} from 'src/app/core/helpers/general.helpers';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { ModalComponent } from 'src/app/core/presentation/components/modal/modal.component';

import { TranslateService } from '@ngx-translate/core';
import {
  DeleteTournamentByIdCommand,
  GetTournamentLayoutByIdCommand,
  GetTournamentsByOrganizationAndTournamentLayoutCommand,
} from 'src/app/features/organizations/organizations.commands';
import {
  selectTournamentLayoutById,
  selectTournamentsByTournamentLayout,
  selectTransactionById,
} from 'src/app/features/organizations/organizations.selector';
import { TransactionDeletedEvent } from '../../organizations.events';
import { EditTournamentComponent } from '../edit-tournament/edit-tournament.component';

@Component({
  selector: 'app-tournaments-by-layout',
  templateUrl: './tournaments-by-layout.component.html',
  styleUrls: ['./tournaments-by-layout.component.scss'],
})
export class TournamentsByLayoutComponent implements OnInit, OnDestroy {
  static route = 'tournaments-by-layout';
  $tournaments!: Observable<IBaseResponse<TournamentEntity[]>>;
  tournaments!: TournamentEntity[];

  organization!: OrganizationEntity;
  filters: { display: string; property: string }[];

  tournamentLayout!: TournamentLayoutEntity;

  tournamentLayouts!: TournamentLayoutEntity[];
  organizationId: any;
  table: { [index: string]: TournamentEntity[] };
  tournamentLayoutId: any;
  selectTransactionByIdSubscription!: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.table = {};
    this.filters = [
      {
        display: 'Nombre',
        property: 'name',
      },
      {
        display: 'Año',
        property: 'category',
      },
      {
        display: 'Etiquetas',
        property: 'category',
      },
    ];
  }
  ngOnDestroy(): void {
    this.selectTransactionByIdSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((queryParams) => {
      this.organizationId = queryParams['organizationId'];
      this.tournamentLayoutId = queryParams['tournamentLayoutId'];

      this.store.dispatch(
        GetTournamentsByOrganizationAndTournamentLayoutCommand({
          organizationId: this.organizationId,
          tournamentLayoutId: this.tournamentLayoutId,
          includeDraft: true,
        })
      );
      this.store.dispatch(
        GetTournamentLayoutByIdCommand({
          organizationId: this.organizationId,
          tournamentLayoutId: this.tournamentLayoutId,
        })
      );

      this.store
        .select(selectTournamentsByTournamentLayout(this.tournamentLayoutId))
        .subscribe((data: TournamentEntity[] | undefined) => {
          if (data) this.tournaments = data;
        });
      this.store
        .select(selectTournamentLayoutById(this.tournamentLayoutId))
        .subscribe((data: TournamentLayoutEntity) => {
          this.tournamentLayout = data;
        });
    });
  }

  deleteTournament(tournamentId: Id) {
    this.dialog.open(ModalComponent, {
      height: '300px',
      width: '300px',
      data: {
        kind: 'text',
        title: 'Deseas eliminar este torneo? ',
        text: 'Si el torneo ya se encuentra en un estado diferente a "Borrador" no se eliminará, por el contrario permanecerá con el estado de "Eliminado".',
        actions: [
          {
            display: 'Aceptar',
            handler: (data) => {
              const transactionId = getTransactionIdentifier(tournamentId);

              this.store.dispatch(
                DeleteTournamentByIdCommand({
                  tournamentId,
                  transactionId,
                })
              );

              const onCloseDialogAction = () => {};
              const onSuccessAction = () => {};

              this.selectTransactionByIdSubscription = admingPopUpInComponent({
                dialog: this.dialog,
                onCloseDialogAction,
                onSuccessAction,
                selectTransactionById,
                store: this.store,
                TransactionDeletedEvent,
                transactionId,
                translateService: this.translateService,
              });
            },
          },
          {
            display: 'Cancelar',
            handler(data) {},
          },
        ] as GeneralAction[],
      },
    });
  }
  editTournament(id: string) {
    this.router.navigate([EditTournamentComponent.route, id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tournamentId: id,
      },
    });
  }

  onClear() {}
}
