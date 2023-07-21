import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if (value) {
      return new Date(value.seconds * 1000).toLocaleString();
    }
    return '';
  }
}
