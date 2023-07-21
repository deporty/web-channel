import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities/general';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { paginateItems } from 'src/app/core/helpers/general.helpers';
import { DEFAULT_ORGANIZATION_IMG } from 'src/app/app.constants';
import { TournamentLayoutListComponent } from '../tournament-layout-list/tournament-layout-list.component';
import { GetOrganizationsCommand } from 'src/app/features/organizations/organizations.commands';
import { selectOrganizations } from 'src/app/features/organizations/organizations.selector';
import { TournamentListComponent } from '../tournament-list/tournament-list.component';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
})
export class OrganizationListComponent implements OnInit {
  static route = 'organization-list';

  pageSize: number;
  length: number;
  pageNumber: number;
  organizations!: Array<Array<OrganizationEntity>>;
  currentOrganizations!: Array<OrganizationEntity>;
  defaultImg = DEFAULT_ORGANIZATION_IMG;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pageSize = 12;
    this.pageNumber = 0;
    this.length = this.pageSize * 2;
  }

  ngOnInit(): void {
    this.store.dispatch(
      GetOrganizationsCommand({
        pageNumber: 0,
        pageSize: this.pageSize,
      })
    );

    this.store.select(selectOrganizations).subscribe((data) => {

      if (data) {
        this.organizations = paginateItems<OrganizationEntity>(
          this.pageSize,
          Object.values(data)
        );
        this.length = Object.keys(data).length;
        this.currentOrganizations = this.organizations[this.pageNumber];
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.store.dispatch(
      GetOrganizationsCommand({
        pageNumber: event.pageIndex,
        pageSize: this.pageSize,
      })
    );
  }

  seeTournaments(organizationId: Id | undefined) {
    this.router.navigate([TournamentListComponent.route], {
      relativeTo: this.route.parent,
      queryParams: {
        organizationId,
      },
    });
  }
}
