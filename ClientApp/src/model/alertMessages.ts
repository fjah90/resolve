import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class alertMessages {
  public setMessage(status: number) {
    switch (status) {
      case 0:
        return (
          'Tiempo de espera de conexión al servidor superado.' +
          '\n' +
          'Si el problema persiste, comuniquese con mesa de ayuda.'
        );
      default:
        return (
          'Tiempo de espera agotado.' +
          '\n' +
          'Si el problema persiste, comuníquese con mesa de ayuda.'
        );
    }
  }
}
