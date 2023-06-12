export class Item {
  barcode: string;
  cuf: string;
  description: string;
  amount: number;
  constructor(
    barcode: string,
    cuf: string,
    description: string,
    amount: number
  ) {
    this.barcode = barcode;
    this.cuf = cuf;
    this.description = description;
    this.amount = amount;
  }
}
