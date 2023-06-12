import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Sucursal } from 'src/app/sucursal/models/Sucursal';

@Injectable()
export class ObservatorSucursal {
  private emisionSucursalObserver = new Subject<Sucursal>();

  constructor() {}

  getEmisionSucursalObservable() {
    return this.emisionSucursalObserver;
  }

  notifyCambioSucursal(sucursal: Sucursal) {
    this.emisionSucursalObserver.next(sucursal);
  }
}
