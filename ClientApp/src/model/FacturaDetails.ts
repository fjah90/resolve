export class FacturaDetails {
  Nombre: string;
  Sku: number;
  PrecioUnitario: number;
  PrecioTotal: number;
  Descuento: number;
  Unidades: number;

  constructor(
    nombre: string,
    sku: number,
    precioUnitario: number,
    precioTotal: number,
    descuento: number,
    unidades: number
  ) {
    this.Nombre = nombre;
    this.Sku = sku;
    this.PrecioUnitario = precioUnitario;
    this.PrecioTotal = precioTotal;
    this.Descuento = descuento;
    this.Unidades = unidades;
  }
}
