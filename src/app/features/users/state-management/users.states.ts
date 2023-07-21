import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { UserEntity } from '@deporty-org/entities/users';

export interface UserState {
  users: { [id: string]: UserEntity };
}
