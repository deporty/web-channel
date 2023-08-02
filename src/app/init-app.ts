import { InjectionToken } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, initializeFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import { isLocationAllowed } from './core/helpers/log-events.helper';
import { LocationPermissionModalComponent } from './core/presentation/components/location-permission-modal/location-permission-modal.component';
import { AuthorizationService } from './features/auth/infrastructure/services/authorization/authorization.service';
import { UserAdapter } from './features/users/infrastructure/user.adapter';
import { decodeJwt } from 'jose';

const firebaseConfig = environment.firebaseConfig;

export const app = initializeApp(firebaseConfig);
export const firestore: Firestore = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export const RESOURCES_PERMISSIONS_IT = new InjectionToken(
  'Injection TOken for resources permissions'
);
export const RESOURCES_PERMISSIONS: string[] = [];

export const USER_INFORMATION: any = {};

export const USER_INFORMATION_IT = new InjectionToken(
  'Injection TOken for user information'
);

export async function checkAllowedPositionPermission(dialog: MatDialog) {
  const data = await isLocationAllowed();
  return new Promise<void>((resolve) => {
    if (data == null || data.state === 'prompt' || data.state === 'denied') {
      const fullDialog = dialog.open(LocationPermissionModalComponent, {
        height: '70vh',
        width: '80vw',
      });
      fullDialog.afterClosed().subscribe(() => {
        navigator.geolocation.getCurrentPosition((loc) => {
          resolve();
        });
      });
    } else {
      resolve();
    }
  });
}
export function initScope(
  dialog: MatDialog,
  userAdapter: UserAdapter,
  authorizationService: AuthorizationService
) {
  return async (): Promise<any> => {
    await checkAllowedPositionPermission(dialog);
    return new Promise(async (resolve, reject) => {
      getAuth(app).onAuthStateChanged((user) => {
        if (user && user.email) {
          const email = user.email;
          USER_INFORMATION['email'] = email;
        }
        resolve(true);
      });
    });
  };
}
