import { logEvent } from 'firebase/analytics';
import { Observable } from 'rxjs';
import { analytics } from 'src/app/init-app';
import { environment } from 'src/environments/environment';

export type EventNames =
  | 'tournaments_views'
  | 'players_views'
  | 'shop_views'
  | 'teams_views'
  | 'shop_views'
  | 'index_views'
  | 'user_time_shop';
export function trackEvent(
  eventName: EventNames,
  data?: {
    [key: string]: any;
  }
) {
  if (environment.analytics) {
    logEvent(analytics, eventName, data);
  }
}

export function isLocationAllowed(): Promise<PermissionStatus | null> {
  if (navigator.permissions) {
    return window.navigator.permissions.query({ name: 'geolocation' });
  } else {
    return Promise.resolve(null);
  }
}

export const DEFAULT_POSITION = { latitude: 5.06889, longitude: -75.51738 };

export function getCurrentGeolocation(): Observable<any> {
  return new Observable((observer) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const response: any = {
          latitude: 0,
          longitude: 0,
          date: null,
          timestamp: null,
        };
        response.date = new Date(position.timestamp);
        response.timestamp = position.timestamp;
        response.latitude = position.coords.latitude;
        response.longitude = position.coords.longitude;
        observer.next(response);
        observer.complete();
      },
      (err) => {
        observer.next(null);
        observer.complete();
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
      }
    );
  });
}
