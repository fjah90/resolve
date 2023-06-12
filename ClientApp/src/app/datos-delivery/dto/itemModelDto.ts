export class ItemModelDto {
  codbarra: string;
  cuf: string;
  cantidad: number;
  descripcion: string;
  constructor(
    barcode: string,
    cuf: string,
    amount: number,
    description: string
  ) {
    this.codbarra = barcode;
    this.cuf = cuf;
    this.cantidad = amount;
    this.descripcion = description;
  }
}
