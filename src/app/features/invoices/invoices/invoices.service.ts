import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@deporty-org/entities/general';
import { ITournamentInvoiceModel } from '@deporty-org/entities/invoices';
import { environment } from 'src/environments/environment';
import { TournamentService } from '../../tournaments/infrastructure/tournament/tournament.service';

@Injectable()
export class InvoicesService {
  static collection = 'invoices';

  constructor(private http: HttpClient) {}

  getInvoicesTournaments(id: string) {
    const path = `${environment.serverEndpoint}/${InvoicesService.collection}/${id}`;
    return this.http.get<IBaseResponse<ITournamentInvoiceModel[]>>(path,{});
  }
}
