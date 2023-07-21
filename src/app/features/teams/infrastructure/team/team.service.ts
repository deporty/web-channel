import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import { IPlayerModel } from '@deporty-org/entities/players';
import {
  MemberDescriptionType,
  MemberEntity,
  TeamEntity,
} from '@deporty-org/entities/teams';
import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore/lite';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'src/app/init-app';
import { environment } from 'src/environments/environment';
import { TeamAdapter } from '../../adapters/team.adapter';

@Injectable()
export class TeamService extends TeamAdapter {
  static collection = 'teams';
  constructor(private httpClient: HttpClient) {
    super();
  }

  getTeamsByFilters(filters: any): Observable<IBaseResponse<TeamEntity[]>> {
    const path = `${environment.serverEndpoint}/${TeamService.collection}/filter`;
    return this.httpClient.get<IBaseResponse<TeamEntity[]>>(path, {
      params: {
        ...filters,
      },
    });
  }

  asignPlayerToTeam(
    teamId: string | undefined,
    playerId: string
  ): Observable<IBaseResponse<MemberEntity>> {
    const path = `${environment.serverEndpoint}/${TeamService.collection}/assign-player`;
    return this.httpClient.put<IBaseResponse<MemberEntity>>(path, {
      teamId,
      playerId,
    });
  }

  getTeamById(teamId: string): Observable<IBaseResponse<TeamEntity>> {
    const path = `${environment.serverEndpoint}/${TeamService.collection}/${teamId}`;
    return this.httpClient.get<IBaseResponse<TeamEntity>>(path);
  }

  getTeams(
    pageSize: number,
    pageNumber: number
  ): Observable<IBaseResponse<TeamEntity[]>> {
    const path = `${environment.serverEndpoint}/${TeamService.collection}/all`;
    return this.httpClient.get<IBaseResponse<TeamEntity[]>>(path, {
      params: {
        pageSize,
        pageNumber,
      },
    });
  }

  createTeam(team: TeamEntity): Observable<string> {
    const teamCollection = collection(firestore, TeamService.collection);
    return from(addDoc(teamCollection, team)).pipe(
      map((data: DocumentReference<DocumentData>) => {
        return data.id;
      })
    );
  }

  deleteTeam(team: TeamEntity): Observable<void> {
    throw new Error('');

    // const teamCollection = doc(firestore, TeamService.collection, team.id);
    // return from(deleteDoc(teamCollection));
  }

  updateTeam(team: TeamEntity): Observable<void> {
    throw new Error('');

    //   const teamCollection = doc(firestore, TeamService.collection, team.id);
    //   const _team = team;
    //   return from(setDoc(teamCollection, _team));
    // }
  }

  getMembersByTeam(
    teamId: string
  ): Observable<IBaseResponse<MemberDescriptionType[]>> {
    const path = `${environment.serverEndpoint}/${TeamService.collection}/${teamId}/members`;
    return this.httpClient.get<IBaseResponse<MemberDescriptionType[]>>(path);
  }
}
