import { Component, OnInit } from '@angular/core';
import { ITournamentInvoiceModel } from '@deporty-org/entities/invoices';
import { IInvoiceStatusType } from '@deporty-org/entities/invoices/invoice.model';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ConsultInvoicesTournament
} from '../../invoices.actions';
import { selectInvoicesCount } from '../../invoices.selector';
import { InvoicesService } from '../../invoices/invoices.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  static route: string = 'index';
  $invoicesTournaments!: Observable<ITournamentInvoiceModel[] | undefined>;
  $organization!: Observable<OrganizationEntity | undefined>;
  user: any;
  constructor(private store: Store<any>, private f: InvoicesService) {}

  ngOnInit(): void {
    this.$invoicesTournaments = this.store.select(selectInvoicesCount);

    // this.$organization = this.store.select(selectCurrentOrganization);
    this.store.dispatch(
      ConsultInvoicesTournament({
        organizationId: '',
      })
    );
    // getAuth(app).onAuthStateChanged((i) => {
    //   this.user = i;
    //   let email = this.user.email;
    //   // email = 'estefania.cortes17@gmail.com';
    //   this.$organization.subscribe((org) => {
    //     if (!org) {
    //       this.store.dispatch(
    //         GetMyOrganization({
    //           email,
    //         })
    //       );
    //     } else {
    //       this.store.dispatch(
    //         ConsultInvoicesTournament({
    //           organizationId: org.id,
    //         })
    //       );
    //     }
    //   });
    // });
  }

  getStatus(status: IInvoiceStatusType) {
    switch (status) {
      case 'overdue':
        return {
          class: 'overdue',
          text: 'En mora',
        };
      case 'paid':
        return {
          class: 'paid',
          text: 'Pagada',
        };

      default:
        return {
          class: 'pending',
          text: 'Pendiente',
        };
    }
  }
}
