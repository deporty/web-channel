import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileAdapter } from '../../adapters/file/file.adapter';
import { BaseUsecase } from '../base.usecase';
export interface Params {
  filePath: string;
  file: File | string;
}
@Injectable()
export class UploadFileUsecase extends BaseUsecase<Params, string> {
  constructor(private fileAdapter: FileAdapter) {
    super();
  }

  call(param: Params): Observable<string> {
    return this.fileAdapter.uploadFile(param.filePath, param.file);
  }
}
