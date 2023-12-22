import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { PermissionEntity, ResourceEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { ItemsFilter } from 'src/app/core/presentation/components/items-filter/items-filter.component';
import { GetPermissionsCommand } from 'src/app/features/administration/state-management/administration.commands';
import { selectPermissions } from 'src/app/features/administration/state-management/administration.selector';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent implements OnInit {
  permissions?: PermissionEntity[];

  filters: ItemsFilter[] = [
    {
      display: 'Tipo',
      property: 'kind',
      values: [
        {
          display: 'API',
          value: 'api',
        },
        {
          display: 'UI',
          value: 'ui',
        },
      ],
    },
    {
      display: 'Capa',
      property: 'layer',
    },
    {
      display: 'Nombre',
      property: 'name',
    },
  ];
  currentPermissions?: PermissionEntity[];

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  onFilter(data: any): void {
    this.currentPermissions = data;
  }
  ngOnInit(): void {
    this.store.dispatch(GetPermissionsCommand());
    this.store.select(selectPermissions).subscribe((data) => {
      if (data && !this.permissions) {
        this.permissions = Object.values(data);
        this.currentPermissions = this.permissions;
        this.cd.detectChanges();
      }
    });
  }
}
