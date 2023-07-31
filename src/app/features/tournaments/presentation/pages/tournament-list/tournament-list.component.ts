import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetTournamentsByOrganizationAndTournamentLayoutCommand } from '../../../state-management/tournaments/tournaments.actions';
import { selectTournamentsByOrganizationAndLayout } from '../../../state-management/tournaments/tournaments.selector';

import { GetTournamentLayoutsByOrganizationIdCommand } from 'src/app/features/organizations/organizations.commands';
import {
  selectOrganizationById,
  selectTournamentLayoutsByOrganizationId,
} from 'src/app/features/organizations/organizations.selector';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
})
export class TournamentListComponent implements OnInit, OnDestroy {
  static route = 'tournament-list';
  $tournaments!: Observable<IBaseResponse<TournamentEntity[]>>;
  tournaments!: TournamentEntity[];

  organization!: OrganizationEntity;
  filters: { display: string; property: string }[];
  menuOptions: {
    display: string;
    background: string;
    color: string;
    enable: () => boolean;
    handler: () => void;
    icon: string;
    identifier: string;
  }[];
  tournamentLayout!: TournamentLayoutEntity;

  tournamentLayouts!: TournamentLayoutEntity[];
  organizationId: any;
  table: { [index: string]: TournamentEntity[] };

  selectTournamentLayoutsByOrganizationIdSubscription!: Subscription;
  selectOrganizationByIdSubscription!: Subscription;
  selectTournamentsByOrganizationAndLayoutSubscription!: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
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

    this.menuOptions = [
      {
        display: 'Crear Torneo',
        background: 'white',
        color: 'red',
        enable: () => true,
        handler: () => {},
        icon: 'add',
        identifier: 'akf;alfa',
      },
    ];
  }
  ngOnDestroy(): void {
    this.selectTournamentLayoutsByOrganizationIdSubscription?.unsubscribe();
    this.selectOrganizationByIdSubscription?.unsubscribe();
    this.selectTournamentsByOrganizationAndLayoutSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.organizationId = queryParams['organizationId'];
      console.log('Organization Id: ', this.organizationId);

      this.store.dispatch(
        GetTournamentLayoutsByOrganizationIdCommand({
          organizationId: this.organizationId,
        })
      );
      this.selectTournamentLayoutsByOrganizationIdSubscription = this.store
        .select(selectTournamentLayoutsByOrganizationId(this.organizationId))
        .subscribe((data: TournamentLayoutEntity[] | undefined) => {
          console.log("XXXXXXXXXXXXXXXXX", data);
          
          if (data) {
            this.tournamentLayouts = data;
            if (this.tournamentLayouts.length > 0) {
              this.tournamentLayout = this.tournamentLayouts[0];
              this.selectionChange(this.tournamentLayout);
            }
          }
        });

      this.selectOrganizationByIdSubscription = this.store
        .select(selectOrganizationById(this.organizationId))
        .subscribe((data: OrganizationEntity | undefined) => {
          if (data) {
            this.organization = data;
          }
        });
    });
  }

  goToTournamentDetail(id: string | undefined) {
    this.router.navigate([TournamentDetailComponent.route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        tournamentId: id,
      },
    });
  }

  selectionChange(tl: TournamentLayoutEntity) {
    const tournamentLayoutId = tl.id;
    this.store.dispatch(
      GetTournamentsByOrganizationAndTournamentLayoutCommand({
        organizationId: this.organizationId,
        tournamentLayoutId: tournamentLayoutId!,
        includeDraft: false,
      })
    );

    if (this.selectTournamentsByOrganizationAndLayoutSubscription) {
      this.selectTournamentsByOrganizationAndLayoutSubscription.unsubscribe();
    }

    this.selectTournamentsByOrganizationAndLayoutSubscription = this.store
      .select(
        selectTournamentsByOrganizationAndLayout(
          this.organizationId,
          tournamentLayoutId!
        )
      )
      .subscribe((data: TournamentEntity[]) => {
        this.tournaments = data;
      });
  }
  onClear() {}
}
