import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEntity } from '@deporty-org/entities/users';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ItemsFilter } from 'src/app/core/presentation/components/items-filter/items-filter.component';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { GetUsersByRolCommand } from '../../state-management/users.commands';
import { selectUsersByRol } from '../../state-management/users.selector';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss'],
})
export class ViewAllComponent implements OnInit {
  static route = 'view-all';

  formGroup: UntypedFormGroup;
  currentPage = 0;
  pageSize = 15;
  $players!: Observable<UserEntity[]>;
  $playersSubscription!: Subscription;
  players: UserEntity[];
  filterPlayers: UserEntity[] | undefined;

  filters: ItemsFilter[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[]
  ) {
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
    this.players = [];

    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      document: new UntypedFormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(
      GetUsersByRolCommand({
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        rol: 'Player',
      })
    );
    this.players = [];
    this.$players = this.store.select(selectUsersByRol('Player'));
    this.$players.subscribe((data) => {
      
      this.players = data;
    });
  }

  onSelectedPlayer(player: UserEntity) {
    const dialogRef = this.dialog.open(PlayerCardComponent, {
      data: player,
      maxWidth: '500px',
    });
  }
  onChangeForm(dataFiltered: UserEntity[]) {
    // this.filterPlayers = dataFiltered;
  }
}
