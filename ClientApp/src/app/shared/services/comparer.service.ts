import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComparerService {
  public compararFechas(a: Date, b: Date, asc: boolean) {
    if (asc) {
      return a.getTime() > b.getTime() ? 1 : -1;
    } else {
      return a.getTime() < b.getTime() ? 1 : -1;
    }
  }

  public compararNumeros(a: Number, b: Number, asc: boolean) {
    if (asc) {
      return a > b ? 1 : -1;
    } else {
      return a < b ? 1 : -1;
    }
  }

  public compararStrings(a: string, b: string, asc: boolean) {
    a = a ? a : '';
    b = b ? b : '';
    if (asc) {
      return a.toLowerCase().trim() > b.toLowerCase().trim() ? 1 : -1;
    } else {
      return a.toLowerCase().trim() < b.toLowerCase().trim() ? 1 : -1;
    }
  }
}
