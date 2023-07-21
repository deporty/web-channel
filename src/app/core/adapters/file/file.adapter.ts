import { Observable } from 'rxjs';

export abstract class FileAdapter {
  abstract uploadFile(filePath: string, file: File | string): Observable<any>;
}
