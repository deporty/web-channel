import { Component, Inject, OnInit } from '@angular/core';
import {
  OrganizationEntity,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import {
  RESOURCES_PERMISSIONS_IT,
  USER_INFORMATION_IT,
  app,
} from 'src/app/init-app';

import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities/general';
import { UserEntity } from '@deporty-org/entities/users';
import { getFullName } from 'src/app/core/helpers/general.helpers';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUsersById } from 'src/app/features/users/state-management/users.selector';
import {
  GetMyOrganizationsCommand,
  GetOrganizationByIdCommand,
  GetTournamentLayoutsByOrganizationIdCommand,
} from '../../organizations.commands';
import {
  selectMyOrganizations,
  selectOrganizationById,
  selectTournamentLayoutsByOrganizationId,
} from '../../organizations.selector';
import { CreateTournamentLayoutComponent } from '../create-tournament-layout/create-tournament-layout.component';
import { CreateTournamentComponent } from '../create-tournament/create-tournament.component';
import { TournamentsByLayoutComponent } from '../tournaments-by-layout/tournaments-by-layout.component';
import { EditTournamentLayoutComponent } from '../edit-tournament-layout/edit-tournament-layout.component';
import { hasPermission } from 'src/app/core/helpers/permission.helper';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.scss'],
})
export class OrganizationDetailComponent implements OnInit {
  static route = 'detail';

  $members!: Observable<UserEntity[]>;
  $organization!: Observable<OrganizationEntity | undefined>;
  $organizations!: Observable<Array<OrganizationEntity> | undefined>;
  $tournamentLayouts!: Observable<TournamentLayoutEntity[]>;
  actions: Array<GeneralAction>;
  getFullName = getFullName;
  memberIds: Array<Id>;
  members: Array<UserEntity>;
  organization!: OrganizationEntity;
  user: any;

  constructor(
    private store: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    @Inject(USER_INFORMATION_IT) protected userInformation: any
  ) {
    this.members = [];
    this.memberIds = [];
    this.actions = [
      {
        identifier: 'create-tournament-layout',
        display: 'Crear Plantillas de Torneo',
        icon: '',
        background: '',
        color: '',
        enable: (config) => {
          return hasPermission(config.identifier, this.resourcesPermissions);
        },
        handler: () => {
          this.router.navigate(
            [this.organization.id, CreateTournamentLayoutComponent.route],
            {
              relativeTo: this.activatedRoute,
            }
          );
        },
      },
      {
        identifier: 'create-tournament',
        display: 'Crear Torneo',
        icon: '',
        background: '',
        color: '',
        enable: (config) => {
          return hasPermission(config.identifier, this.resourcesPermissions);
        },
        handler: () => {
          this.router.navigate(
            [this.organization.id, CreateTournamentComponent.route],
            {
              relativeTo: this.activatedRoute,
            }
          );
        },
      },
    ];
  }

  editTournamentLayout(tournamentLayoutId: Id) {
    this.router.navigate(
      [
        this.organization.id,
        EditTournamentLayoutComponent.route,
        tournamentLayoutId,
      ],
      {
        relativeTo: this.activatedRoute.parent,
      }
    );
  }

  getData(organizationId: Id) {
    this.store
      .select(selectOrganizationById(organizationId))
      .subscribe((value) => {
        if (value) {
          // this.organization = value;
          if (this.members.length == 0) {
            this.memberIds = value.members;

            this.$members = this.store.select(selectUsersById(this.memberIds));
            const $members = value.members.map((memberId) => {
              this.store.dispatch(
                GetUserByIdCommand({
                  id: memberId,
                })
              );
            });
          }
        }
      });

    this.$tournamentLayouts = this.store.select(
      selectTournamentLayoutsByOrganizationId(organizationId)
    );

    this.store.dispatch(
      GetTournamentLayoutsByOrganizationIdCommand({
        organizationId: organizationId,
      })
    );

    this.store.dispatch(
      GetOrganizationByIdCommand({
        organizationId: organizationId,
      })
    );
  }

  ngOnInit(): void {
    this.$organizations = this.store.select(selectMyOrganizations);

    this.$organizations.subscribe((a) => {
      if (a) {
        if (a.length > 0) {
          this.getData(a[0].id!);
          this.organization = a[0];
        }
      }
    });
    if (this.userInformation.user) {
      const email = this.userInformation.user.email;

      this.store.dispatch(
        GetMyOrganizationsCommand({
          email,
        })
      );
    }
  }

  seeTournaments(tournamentLayoutId: Id) {
    this.router.navigate(
      [
        this.organization.id,
        TournamentsByLayoutComponent.route,
        tournamentLayoutId,
      ],
      { relativeTo: this.activatedRoute }
    );
  }

  selectionChange(value: any) {
    this.getData(value.id);
  }
}
