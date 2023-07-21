import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdsUsecase } from './get-ads/get-ads.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@NgModule({
  providers: [GetAdsUsecase],
  imports: [CommonModule, InfrastructureModule],
})
export class UsecasesModule {}
