import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getBreakpoint } from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { ItemsFilter } from 'src/app/core/presentation/components/items-filter/items-filter.component';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import {
  GetTeamsByFiltersCommand,
  GetTeamsCommand,
} from '../../../state-management/teams.commands';
import {
  selectFilteredTeams,
  selectTeams,
} from '../../../state-management/teams.selectors';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  static route = 'team-list';
  isDesktop = true;
  options: GeneralAction[];
  $teams!: Observable<TeamEntity[]>;
  teams: TeamEntity[];
  paginatedTeams: TeamEntity[][];
  currentPaginatedTeams: TeamEntity[] | undefined;
  filteredTeams!: TeamEntity[] | undefined;
  filters: ItemsFilter[];

  length!: number;
  pageSize = 12;
  pageSizeOptions: number[] = [10];

  pageEvent!: PageEvent;
  currentPage: number;
  sidenavOptions: GeneralAction[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
    this.currentPage = 0;
    this.teams = [];
    this.currentPaginatedTeams = [];
    this.paginatedTeams = [];
    this.store.dispatch(
      GetTeamsCommand({
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
      })
    );
    this.filters = [
      {
        display: 'Nombre',
        property: 'name',
      },
      {
        display: 'Categoría',
        property: 'category',
      },
    ];
    this.options = [
      {
        color: 'white',
        background: '#24abc1',
        handler: (team: TeamEntity) => {
          this.navigate(team);
        },
        icon: 'visibility',
        identifier: 'watch-team',
        enable: (config) => true,
      },
    ];
    this.sidenavOptions = [
      {
        color: '#24abc1',
        background: 'white',
        handler: (team: TeamEntity) => {
          this.router.navigateByUrl('./create-team');
        },
        display: 'Crear equipo',
        icon: 'add',
        identifier: 'teams:create-team:ui',
        enable: (config) =>
          hasPermission(config.identifier, this.resourcesPermissions),
      },
    ];
  }

  getData() {
    const data = this.currentPaginatedTeams || this.filteredTeams || [];
    return data;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  onClear() {
    this.filteredTeams = undefined;
    this.currentPaginatedTeams = this.paginatedTeams[this.currentPage];
  }
  onChangeForm(data: any) {
    this.currentPaginatedTeams = undefined;
    if (Object.keys(data).length > 0) {
      this.store.dispatch(
        GetTeamsByFiltersCommand({
          filters: data,
        })
      );
    } else {
      this.onClear();
    }
  }


  ngOnInit(): void {
    this.$teams = this.store.select(selectTeams);
    this.$teams.subscribe((x) => {
      this.teams = x;
      this.paginateTeams(this.teams);

      this.length = this.teams.length + this.pageSize;
    });

    this.store.select(selectFilteredTeams).subscribe((data) => {
      if (data) this.filteredTeams = data;
    });
    window.onresize = (event) => {
      const window = event.target as Window;
      this.knowScreen(window.innerWidth);
    };

    this.knowScreen(window.innerWidth);
  }

  paginateTeams(matches: TeamEntity[]) {
    let temp = [];
    let i = 1;
    this.paginatedTeams = [];
    for (const match of matches) {
      temp.push(match);
      if (i == this.pageSize) {
        this.paginatedTeams.push([...temp]);
        i = 0;
        temp = [];
      }
      i++;
    }
    if (temp.length > 0) {
      this.paginatedTeams.push([...temp]);
    }
    if (this.paginatedTeams.length > 0) {
      this.currentPaginatedTeams = this.paginatedTeams[this.currentPage];
    }
  }
  pageChanged(pageEvent: PageEvent) {
    this.pageEvent = pageEvent;
    this.currentPage = pageEvent.pageIndex;

    if (this.currentPage >= this.paginatedTeams.length) {
      this.store.dispatch(
        GetTeamsCommand({
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
        })
      );
    } else {
      this.currentPaginatedTeams = this.paginatedTeams[this.currentPage];
    }
  }

  knowScreen(width: number) {
    const breakpoint = getBreakpoint(width);
    this.isDesktop = breakpoint != 'xs';
  }
  // receiveSelectedOption(option: any) {
  //   const key = this.options[option.index];
  // }

  navigate(team: TeamEntity) {
    this.router.navigate(['./team', team.id], {
      relativeTo: this.route,
    });
  }
}
