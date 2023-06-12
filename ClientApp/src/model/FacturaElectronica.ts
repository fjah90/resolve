import * as internal from 'assert';
import { FacturaDetails } from './facturaDetails';
import { Item } from './item';

export class FacturaElectronica {
  Numero: number;
  Dni: string;
  Total: number;
  TotalConDescuento: number;
  Descuento: number;
  CAE: number;
  VencimientoCAE: Date;
  NumeroSucursal: number;
  NombreSucursal: string;
  PuntoDeVenta: number;
  Email: string;
  NombreCliente: string;
  FechaEmision: Date;
  Tipo: TipoFactura;
  Estado: EstadoAFIP;
  ErrorMessage: string;
  NroComprobanteFarma: number; 
  Detalles: FacturaDetails[];

  constructor(
    numero: number,
    dni: number,
    total: number,
    totalDescuento: number,
    descuento: number,
    cae: number,
    venc: Date,
    sucursal: number,
    pos: number,
    email: string,
    nombreCliente: string,
    fechaGeneracion: string,
    tipoFactura: number,
    error: boolean,
    errorMsg: string,
    nroComprobante: number,
    items: Item[]
  ) {
    this.Numero = numero;
    this.Dni = dni.toString();
    this.Total = total;
    this.TotalConDescuento = totalDescuento;
    this.Descuento = descuento;
    this.CAE = cae;
    this.VencimientoCAE = cae !== null ? venc : null;
    this.NumeroSucursal = sucursal;
    this.PuntoDeVenta = pos;
    this.Email = email;
    this.NombreCliente = nombreCliente;
    this.Tipo = TipoFactura[tipoFactura.toString()];
    this.FechaEmision = parseDate(fechaGeneracion);
    this.Estado = getEstado(cae, error);
    this.ErrorMessage = errorMsg !== null ? errorMsg.trim() : null;
    this.NroComprobanteFarma = nroComprobante;
    this.Detalles = getItems(items);
  }
}

function getEstado(cae: number, err: boolean) {
  if (cae !== null) {
    return EstadoAFIP.FACTURADO;
  } else if (err) {
    return EstadoAFIP.ERROR;
  } else {
    return EstadoAFIP.PENDIENTE;
  }
}

function parseDate(date: string) {
  return new Date(
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`.replace(
      '-',
      '/'
    )
  );
}

function getItems(items: Item[]) {
  return items.map(
    (item: Item) =>
      new FacturaDetails(
        item.ProductDetail,
        item.Sku,
        item.UnitPrice,
        item.TotalPrice,
        item.DiscountAmount,
        item.Units
      )
  );
}

export enum EstadoAFIP {
  ERROR,
  PENDIENTE,
  FACTURADO,
}

export enum TipoFactura {
  'FACTURA B' = 6,
  'NOTA CREDITO B' = 8,
  'FACTURA A' = 1,
  'NOTA CREDITO A' = 3
}
