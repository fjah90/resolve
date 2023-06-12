import { paymentMethodCardModel } from './paymentMethodCard.model';

export class DropdownOptions {
  pointsOfSale: Array<number>;
  paymentMethods: Array<string>;
  brands: Array<string>;
  paymentCardsCredit: Array<paymentMethodCardModel>;
  paymentCardsDebit: Array<paymentMethodCardModel>;

  constructor(
    pointsOfSale: Array<number>,
    paymentMethods: Array<string>,
    paymentcardscredit: Array<paymentMethodCardModel>,
    paymentcardsdebit: Array<paymentMethodCardModel>,
    brands: Array<string>
  ) {
    this.pointsOfSale = pointsOfSale;
    this.paymentMethods = paymentMethods;
    this.paymentCardsCredit = paymentcardscredit;
    this.paymentCardsDebit = paymentcardsdebit;
    this.brands = brands;
  }
}
