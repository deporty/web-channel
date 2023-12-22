import { IBaseResponse, Id, TournamentEntity } from "@deporty-org/entities";
import { Observable } from "rxjs";

export abstract class AdministrationContract {
  abstract calculateTournamentCost(tournamentId: Id): Observable<IBaseResponse<TournamentEntity>>;

}