import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params } from '@angular/router';
import { UserEntity } from '@deporty-org/entities';
import {
  MemberDescriptionType,
  SportEntity,
  TeamEntity,
} from '@deporty-org/entities/teams';
import { Store } from '@ngrx/store';
import { logEvent } from 'firebase/analytics';
import { paginateItems } from 'src/app/core/helpers/general.helpers';
import { GeneralAction } from 'src/app/core/interfaces/general-action';
import { ItemsFilter } from 'src/app/core/presentation/components/items-filter/items-filter.component';
import { RESOURCES_PERMISSIONS_IT, analytics } from 'src/app/init-app';
import { environment } from 'src/environments/environment';
import { TeamAdapter } from '../../../adapters/team.adapter';
import {
  GetSportByIdCommand,
  GetTeamsMembersCommand,
} from '../../../state-management/teams.commands';
import {
  selectSportById,
  selectTeamMembersByTeamId,
} from '../../../state-management/teams.selectors';
import { CreateAddPlayerComponent } from '../../components/create-add-player/create-add-player.component';
import { CreatePlayerComponent } from '../../components/create-player/create-player.component';
import { hasPermission } from 'src/app/core/helpers/permission.helper';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  static route = 'team';

  selectedMember: any;
  selectedPlayers: UserEntity[];
  membersFormControl: UntypedFormControl;

  team!: TeamEntity;
  $players: any;

  availablePlayers: UserEntity[];

  members!: MemberDescriptionType[][];
  currentMembers!: MemberDescriptionType[];

  filters: ItemsFilter[];

  filteredPlayers: UserEntity[];

  length!: number;
  pageSize: number;

  menuOptions: Array<GeneralAction>;
  sport!: SportEntity;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamAdapter,
    private store: Store,
    private dialog: Dialog,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
    this.menuOptions = [
      {
        display: 'Registrar jugador',
        background: 'white',
        color: 'red',
        enable: () => false,
        handler: () => {
          const dialog = this.dialog.open(CreateAddPlayerComponent, {
            height: '70vh',
            width: '80vw',
          });
          dialog.closed.subscribe(() => {
            const createPlayerDialog = this.dialog.open(CreatePlayerComponent, {
              height: '70vh',
              width: '80vw',
            });
          });
        },
        icon: 'add',
        identifier: 'akf;alfa',
      },
      {
        display: 'Imprimir nómina',
        background: 'white',
        color: 'dodgerblue',
        enable: (config) => {
          return hasPermission(config.identifier, this.resourcesPermissions);
        },
        handler: (config) => {},
        icon: 'print',
        identifier: 'print-player-form',
      },
    ];
    this.membersFormControl = new UntypedFormControl();
    this.selectedPlayers = [];
    this.filteredPlayers = [];
    this.availablePlayers = [];
    this.pageSize = 8;
    this.filters = [
      {
        display: 'Nombre',
        property: 'name',
        icon: 'person',
      },
      {
        display: 'Apellidos',
        property: 'lastName',
        icon: 'short_text',
      },
      {
        display: 'Cédula',
        property: 'document',
        icon: 'fingerprint',
      },
    ];
  }

  onChangeForm(dataFiltered: UserEntity[]) {
    this.filteredPlayers = dataFiltered;
  }

  pageChanged(event: PageEvent) {
    this.currentMembers = this.members[event.pageIndex];
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: params.id,
        })
      );

      this.store
        .select(selectTeamMembersByTeamId(params.id))
        .subscribe((data: MemberDescriptionType[]) => {
          if (data) {
            this.members = paginateItems<MemberDescriptionType>(
              this.pageSize,
              data
            );

            this.currentMembers = this.members[0];
            this.length = data.length;
          }
        });
      this.teamService.getTeamById(params.id).subscribe((team) => {

        this.team = team.data;
        if (this.team.sportIds) {
          this.store.dispatch(
            GetSportByIdCommand({
              sportId: this.team.sportIds[0],
            })
          );
          this.store
            .select(selectSportById(this.team.sportIds[0]))
            .subscribe((data) => {
              if (data) this.sport = data;
            });
        }

        // this.ownPlayers = this.team.members?.map((x) => x.player) || [];
      });
    });
    // this.playerService.getAllSummaryPlayers().subscribe((p) => {
    //   this.availablePlayers = p.data;
    //   this.filteredPlayers = this.availablePlayers;

    // });

    if (environment.analytics) {
      logEvent(analytics, 'team');
    }
  }

  remove(player: UserEntity) {
    const index = this.selectedPlayers.indexOf(player);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    }
  }

  addPlayers() {
    for (const player of this.selectedPlayers) {
      this.teamService
        .asignPlayerToTeam(this.team.id, player.id as string)
        .subscribe((data) => {
          // if (data.meta.code == 'TEAM-PLAYER-ASSIGNED:SUCCESS') {
          //   this.team.members?.push(data.data);
          //   this.ownPlayers = this.team.members?.map((x) => x.player) || [];
          // }
        });
    }
    this.selectedPlayers = [];
  }
  optionSelected(player: UserEntity) {
    const index = this.selectedPlayers.indexOf(player);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    } else {
      this.selectedPlayers.push(player);
    }
  }
}
