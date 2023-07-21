import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUsecase } from 'src/app/core/usecases/base.usecase';
import { AdAdapter } from '../../adapter/ad.adapter';
import { IAdModel } from '../../entities/ad.model';

@Injectable()
export class GetAdsUsecase extends BaseUsecase<any, IAdModel[]> {
  constructor(private adAdapter: AdAdapter) {
    super();
  }

  call(): Observable<IAdModel[]> {
    return this.adAdapter.getAds();
  }
}
