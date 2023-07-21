import { Injectable } from '@angular/core';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'src/app/init-app';
import { AdAdapter } from '../adapter/ad.adapter';
import { IAdModel } from '../entities/ad.model';
import { AdMapper } from './ad.mapper';

@Injectable()
export class AdsService extends AdAdapter {
  static collection = 'ads';
  constructor(private adMapper: AdMapper) {
    super();
  }

  updateAd(ad: IAdModel): Observable<IAdModel> {
    const refe = doc(firestore, AdsService.collection, ad.id);
    return from(updateDoc(refe, this.adMapper.toJson(ad))).pipe(map((x) => ad));
  }
  getAds(): Observable<IAdModel[]> {
    const refe = collection(firestore, AdsService.collection);
    return from(getDocs(refe)).pipe(
      map((items) => {
        return items.docs
          .filter((x) => {
            return x.data()['status'] === 'active';
          })

          .map((x) => {
            return this.adMapper.fromJson({ ...x.data(), id: x.id });
          });
      })
    );
  }
}
