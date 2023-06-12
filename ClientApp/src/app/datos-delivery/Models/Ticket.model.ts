import {
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/adapters/adapter';
import { TicketModelDto } from '../dto/ticketModelDto';
import { paymentMethodCardModel } from './paymentMethodCard.model';

export class Ticket {
  branchOffice: string;
  pointOfSale: number;
  invoiceId: number;
  openingNumber: number;
  invoiceType: string;
  workDate: string;
  noData: boolean;
  applicationNumber: number;
  paymentMethod: string;
  fee: number;
  couponNumber: string;
  price: number;
  idMPOperation: string;
  paymentMethodInvoiceId: number;
  cardLast4Numbers: string;
  brand: paymentMethodCardModel = new paymentMethodCardModel();
  gatewayType:string;
  containsCreditNote:boolean;

  constructor(
    branchOffice: string,
    pointOfSale: number,
    invoiceId: number,
    openingNumber: number,
    invoiceType: string,
    workDate: string,
    applicationNumber: number,
    paymentMethod: string,
    brand: string,
    brandCode: number,
    fee: number,
    price: number,
    paymentMethodInvoiceId: number,
    idMPOperation: string,
    cardLast4Numbers: string,
    couponNumber: string,
    noData: boolean,
    gatewayType:string,
    containsCreditNote:boolean
  ) {
    this.branchOffice = branchOffice;
    this.pointOfSale = pointOfSale;
    this.invoiceId = invoiceId;
    this.openingNumber = openingNumber;
    this.invoiceType = invoiceType;
    this.workDate = workDate;
    if (applicationNumber !== 0) {
      this.applicationNumber = applicationNumber;
    }
    this.noData = noData;
    this.price = price;
    this.paymentMethod = paymentMethod;
    this.paymentMethodInvoiceId = paymentMethodInvoiceId;
    if (brand && brandCode) {
      this.brand.descripcion = brand;
      this.brand.codigo = brandCode;
    }
    if (fee !== 0) {
      this.fee = fee;
    }
    this.couponNumber = couponNumber;
    if (idMPOperation !== '0') {
      this.idMPOperation = idMPOperation;
    }
    this.cardLast4Numbers = cardLast4Numbers;
    this.gatewayType = gatewayType;
    this.containsCreditNote = containsCreditNote;
  }
}
