import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';

import { GetTournamentLayoutsByOrganizationIdCommand } from 'src/app/features/organizations/organizations.commands';
import {
  selectOrganizationById,
  selectTournamentLayoutsByOrganizationId,
} from 'src/app/features/organizations/organizations.selector';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';
import { TournamentListComponent } from '../tournament-list/tournament-list.component';

@Component({
  selector: 'app-tournament-layout-list',
  templateUrl: './tournament-layout-list.component.html',
  styleUrls: ['./tournament-layout-list.component.scss'],
})
export class TournamentLayoutListComponent implements OnInit {
  static route = 'tournament-layout-list';
  $tournaments!: Observable<IBaseResponse<TournamentEntity[]>>;
  tournamentLayouts!: TournamentLayoutEntity[];

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
  organizationId: any;

  constructor(
    private tournamentService: TournamentAdapter,

    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
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

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {

      this.organizationId = queryParams['organizationId'];

      this.store.dispatch(
        GetTournamentLayoutsByOrganizationIdCommand({
          organizationId: queryParams['organizationId'],
        })
      );

      this.store
        .select(selectTournamentLayoutsByOrganizationId(this.organizationId))
        .subscribe((data: TournamentLayoutEntity[] | undefined) => {

          if (data) this.tournamentLayouts = data;
        });

      this.store
        .select(selectOrganizationById(this.organizationId))
        .subscribe((data: OrganizationEntity | undefined) => {

          if (data) {
            this.organization = data;
          }
        });
    });
  }

  goToTournamentList(id: string | undefined) {
    this.router.navigate([TournamentListComponent.route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        tournamentLayoutId: id,
        organizationId: this.organizationId,
      },
    });
  }

  onClear() {}
}
