import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';

import { StoreModule } from '@ngrx/store';
import { InvoicesReducer, invoicesKey } from './invoices.reducer';
import { PagesModule } from './pages/pages.module';
import { InvoicesService } from './invoices/invoices.service';
import { EffectsModule } from '@ngrx/effects';
import { InvoicesEffects } from './invoice.effects';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesModule,
    HttpClientModule,
    InvoicesRoutingModule,
    StoreModule.forFeature(invoicesKey, InvoicesReducer),
    EffectsModule.forFeature([InvoicesEffects]),
  ],
  providers: [InvoicesService],
})
export class InvoicesModule {}
