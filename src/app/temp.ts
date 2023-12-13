import { UserEntity } from '@deporty-org/entities';

export function isValid(user: UserEntity | undefined) {
  return !!user && user.email != 'soporte.ccm@gmail.com';
}
