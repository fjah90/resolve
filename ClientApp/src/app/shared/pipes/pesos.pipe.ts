import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesos',
})
export class PesosPipe implements PipeTransform {
  transform(value: number): any {
    return value.toFixed(2);
  }
}
