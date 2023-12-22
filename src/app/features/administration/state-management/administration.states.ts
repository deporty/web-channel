import { PermissionEntity, ResourceEntity, RoleEntity, TournamentEntity } from "@deporty-org/entities";

export interface AdministrationState {
  tournaments?: {
    [tournamentId: string]: TournamentEntity
  };
  roles?: {
    [roleId: string]: RoleEntity
  };
  permissions?: {
    [permissionId: string]: PermissionEntity
  };
  resources?: {
    [resourceId: string]: ResourceEntity
  };
  transactions: {
    [id: string]: {
      code: string;
      message: string;
    };
  };
}

