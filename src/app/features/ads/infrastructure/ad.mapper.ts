import { Injectable } from '@angular/core';
import { IAdModel } from '../entities/ad.model';

@Injectable()
export class AdMapper {
  fromJson(obj: any): IAdModel {
    return {
      id: obj['id'],
      defaultAd: obj['default-ad'],
      status: obj['status'],
      title: obj['title'],
      link: obj['link'],
      adBreakpoint: obj['ad-breakpoint'],
      counterClicks: obj['counter-clicks'],
    };
  }

  toJson(obj: IAdModel): any {
    return {
      id: obj.id,
      'default-ad': obj.defaultAd,
      status: obj.status,
      title: obj.title,
      link: obj.link,
      'ad-breakpoint': obj.adBreakpoint,
      'counter-clicks': obj.counterClicks,
    };
  }
}
