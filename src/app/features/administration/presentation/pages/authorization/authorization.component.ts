import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { GetRolesCommand } from '../../../state-management/administration.commands';
import {
  selectPermissionsByIds,
  selectResourcesByIds,
  selectRoles,
} from '../../../state-management/administration.selector';
import {
  Id,
  PermissionEntity,
  ResourceEntity,
  RoleEntity,
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent implements OnInit {
  static route = 'authorization';

  $roles!: Observable<RoleEntity[]>;
  selectedRole: RoleEntity | undefined;
  selectedPermission: PermissionEntity | undefined;
  selectedResource: ResourceEntity | undefined;

  $permissionsByRole?: Observable<PermissionEntity[] | null>;
  $resourcesByPermission?: Observable<ResourceEntity[] | null>;
  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.dispatch(GetRolesCommand());
    this.$roles = this.store.select(selectRoles).pipe(
      map((data) => {
        if (data) {
          this.cd.detectChanges();
          return Object.values(data);
        }
        return [];
      })
    );
  }

  selectRole(role: RoleEntity) {
    this.selectedRole = role;
    this.selectedPermission = undefined;
    this.selectedResource = undefined;

    this.$permissionsByRole = this.store.select(
      selectPermissionsByIds(role.permissionIds)
    );
  }

  selectPermission(permission: PermissionEntity) {
    this.selectedPermission = permission;
    this.selectedResource = undefined;

    this.$resourcesByPermission = this.store.select(
      selectResourcesByIds(permission.resourceIds)
    );
  }
  selectResource(resource: ResourceEntity) {
    this.selectedResource = resource;
  }
}
