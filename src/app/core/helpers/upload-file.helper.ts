import { ref, uploadBytes } from 'firebase/storage';
import { from, Observable } from 'rxjs';

import { storage } from 'src/app/init-app';

export function uploadFileToStorage(
  fullPath: string,
  file: File
): Observable<any> {
  const storageRef = ref(storage, fullPath);

  return from(uploadBytes(storageRef, file));
}

export function getExtensionFileFromBase64(base64: string) {
  const extension = base64.split(',')[0].split('/')[1].split(';')[0];
  return extension;
}

export function getBase64Image(img: HTMLImageElement): Observable<string> {
  const observable = new Observable<string>((observer) => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    img.onload = (e: Event) => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.width);
      }
      try {
        var dataURL = canvas.toDataURL();
        const base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');

        observer.next(base64);
      } catch (error) {
        observer.error(error);
      }
    };
  });

  return observable;
}
