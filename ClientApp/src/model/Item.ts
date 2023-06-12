import { Iva } from './iva';

export interface Item {
  ItemID: number;
  Sku: number;
  Cuf: number;
  ProductDetail: string;
  Units: number;
  UnitPrice: number;
  TotalPrice: number;
  DiscountAmount: number;
  TaxedAmount: number;
  ExemptAmount: number;
  TributeAmount: number;
  Iva: Iva;
}
