import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import {
  MemberDescriptionType
} from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MemberAdapter } from '../../adapters/member.adapter';

@Injectable()
export class MemberService extends MemberAdapter {
  static collection = 'teams';
  constructor(private httpClient: HttpClient) {
    super();
  }

  getMemberById(
    teamId: string,
    memberId: string
  ): Observable<IBaseResponse<MemberDescriptionType>> {
    const path = `${environment.serverEndpoint}/${MemberService.collection}/${teamId}/member/${memberId}`;
    return this.httpClient.get<IBaseResponse<MemberDescriptionType>>(path);
  }
}
