import { UserEntity } from '@deporty-org/entities';

export function isValid(user: UserEntity | undefined) {
  console.log(user);
  console.log(user && user.email != 'soporte.ccm@gmail.com');
  
  
  return !!user && user.email != 'soporte.ccm@gmail.com';
}
