import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Pipe({
  name: 'externalResource',
})
export class ExternalResourcePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value) {
      return this.getAbsolutePath(value);
    }
    return '';
  }

  private getAbsolutePath(path: string) {
    if (!path.startsWith('http')) {
      var projectName = environment.firebaseConfig.projectId;
      var u = path.replace(/\//g, '%2F');
      var response = `https://firebasestorage.googleapis.com/v0/b/${projectName}.appspot.com/o/${u}?alt=media`;
      return response;
    }
    return path;
  }
}
