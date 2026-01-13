import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
  standalone: true,
})
export class KeysPipe implements PipeTransform {
  transform(value: object | null | undefined): string[] {
    if (!value) return [];
    return Object.keys(value);
  }
}
