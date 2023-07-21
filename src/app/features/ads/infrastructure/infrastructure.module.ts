import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdMapper } from './ad.mapper';
import { AdAdapter } from '../adapter/ad.adapter';
import { AdsService } from './ads.service';

@NgModule({
  providers: [
    AdMapper,
    {
      provide: AdAdapter,
      useClass: AdsService,
    },
  ],
  imports: [CommonModule],
})
export class InfrastructureModule {}
