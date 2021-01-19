import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimWhitespace',
})
export class TrimWhitespacePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return value ? value.replace(/ /g, '') : '';
  }
}
