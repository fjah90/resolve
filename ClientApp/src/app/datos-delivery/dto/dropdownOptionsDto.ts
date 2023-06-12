import { paymentMethodCardModel } from '../Models/paymentMethodCard.model';

export class DropdownOptionsDto {
  cajas: Array<number>;
  formasDePago: Array<string>;
  tarjetasCredito: Array<paymentMethodCardModel>;
  tarjetasDebito: Array<paymentMethodCardModel>;
  marcas: Array<string>;
}
