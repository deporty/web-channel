import { Injectable } from '@angular/core';
import { ref, uploadBytes } from 'firebase/storage';
import { from, Observable } from 'rxjs';
import { storage } from 'src/app/init-app';
import { FileAdapter } from '../../adapters/file/file.adapter';

@Injectable()
export class FileService extends FileAdapter {
  constructor() {
    super();
  }

  dataURLtoFile(dataurl: string, filename: string) {
    var arr: any = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  uploadFile(filePath: string, file: File | string): Observable<any> {
    const storageRef = ref(storage, filePath);
    let newFile: File;
    const fileName: string = filePath.split('/').pop() as string;
    if (typeof file == 'string') {
      newFile = this.dataURLtoFile(file, fileName);
    } else {
      newFile = file;
    }
    return from(uploadBytes(storageRef, newFile));
  }
}
