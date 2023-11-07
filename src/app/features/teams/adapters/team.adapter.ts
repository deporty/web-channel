import { IBaseResponse, Id } from '@deporty-org/entities/general';
import { IPlayerModel } from '@deporty-org/entities/players';
import { MemberDescriptionType, MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';



export abstract class TeamAdapter {
  abstract getTeams(pageSize: number,pageNumber: number): Observable<IBaseResponse<TeamEntity[]>>;
  abstract getTeamsByFilters(filters: any): Observable<IBaseResponse<TeamEntity[]>>;
  abstract createTeam(team: TeamEntity): Observable<string>;
  abstract deleteTeam(team: TeamEntity): Observable<void>;
  abstract getTeamById(teamId: string): Observable<IBaseResponse<TeamEntity>>;
  abstract getTeamsByIds(teamIds: Id[]): Observable<IBaseResponse<TeamEntity[]>>;
  abstract updateTeam(team: TeamEntity): Observable<void>;
  abstract getMembersByTeam(teamId: string): Observable<IBaseResponse<MemberDescriptionType[]>>;
  abstract asignPlayerToTeam(teamId: string | undefined, playerId: String): Observable<IBaseResponse<MemberEntity>>;

}
