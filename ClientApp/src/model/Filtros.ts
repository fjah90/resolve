import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Filtros {
  public armadoFiltros(arrayFiltros: any) {
    let condiciones = '';

    for (let intCont = 0; intCont <= arrayFiltros.length - 1; intCont++) {
      const condicion = arrayFiltros[intCont];
      condiciones +=
        condicion + (intCont === arrayFiltros.length - 1 ? '' : ',').toString();
    }

    const condicionFinal = btoa('[' + condiciones + ']');

    return condicionFinal;
  }
}
