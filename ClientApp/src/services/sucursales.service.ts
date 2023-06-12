import { Injectable } from '@angular/core';
import { ServiceGen } from './serviceGen.service';
import { Sucursales } from 'src/model/Sucursales';
import { Filtros } from 'src/model/Filtros';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SucursalesTodas {
  arrSucursales: Sucursales[] = [];

  constructor(private service: ServiceGen, private filtros: Filtros) {}

  loadSucursalGlobal() {
    const condiciones = [];

    condiciones.push('{"campo":"estado","comparacion":"=","valor":\'F\'}');
    condiciones.push(
      '{"campo":"esCentroDistribucion","comparacion":"=","valor":0}'
    );

    // this.service.getAll('VW_Sucursales',
    //                     undefined,
    //                     undefined,
    //                     this.filtros.armadoFiltros(condiciones))
    //             .subscribe( response => { this.arrSucursales = response; localStorage.setItem('lstSucursales', JSON.stringify(this.arrSucursales)); }
    // );
  }
}
