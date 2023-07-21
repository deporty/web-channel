import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { MemberDescriptionType } from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';



export abstract class MemberAdapter {
  abstract getMemberById(teamId: Id, memberId: Id): Observable<IBaseResponse<MemberDescriptionType>>;

}
