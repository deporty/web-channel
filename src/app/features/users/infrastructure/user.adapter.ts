import { Observable } from 'rxjs';
import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { UserEntity } from '@deporty-org/entities/users';
import { ROL } from '@deporty-org/entities/authorization';

export abstract class UserAdapter {
  abstract getUserById(userId: Id): Observable<IBaseResponse<UserEntity>>;
  abstract getUsersByRol(
    rol: ROL,
    pageNumber: number,
    pageSize: number
  ): Observable<IBaseResponse<UserEntity[]>>;
  abstract getUsersByFilters(
    roles: Id[],
    firstName: string,
    firstLastName: string,
    secondName: string,
    secondLastName: string
  ): Observable<IBaseResponse<UserEntity[]>>;
  abstract getUserByEmail(email: string): Observable<IBaseResponse<UserEntity>>;
}
