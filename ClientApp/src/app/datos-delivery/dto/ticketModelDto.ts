import { paymentMethodCardModel } from '../Models/paymentMethodCard.model';

export class TicketModelDto {
  idSucursal: string;
  nroCaja: number;
  nroComprobante: number;
  fechaDeTrabajo: string | null;
  nroApertura: number;
  formatoSucursal: string;
  direccionSucursal: string;
  nroCajero: number;
  tipoComprobante: string;
  origenDescuento: string;
  items: any[];
  cupones: string[];
  pagos: PagoModel[];
  descuentos: any[];
  totales: TotalesModel;
  idKeyCliente: string;
  ofertas: any;
  cliente: any;
  referenceId: string;
  nroOrden: string;
  codMotivoNC: number;
  comprobanteRelacion: any;
  idOrigenVenta: number;
  nroSolicitud: number;
  sinDatos: boolean;
  tipoGateway:string;
  contieneNC:boolean;

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
    couponNumber: string,
    idMPOperation: string,
    paymentMethodInvoiceId: number,
    price: number,
    last4Numbers: string,
    noData: boolean,
    gatewayType:string,
    containsCreditNote:boolean
  ) {
    this.idSucursal = branchOffice;
    this.nroCaja = pointOfSale;
    this.nroComprobante = invoiceId;
    this.nroApertura = openingNumber;
    this.tipoComprobante = invoiceType;
    this.fechaDeTrabajo = workDate;
    this.nroSolicitud = applicationNumber;
    this.sinDatos = noData;
    this.pagos = [];
    const pago = new PagoModel(
      paymentMethod,
      brand,
      brandCode,
      fee,
      couponNumber,
      idMPOperation,
      paymentMethodInvoiceId,
      price,
      last4Numbers,
      gatewayType
    );
    this.pagos.push(pago);
    this.tipoGateway = gatewayType;
    this.contieneNC = containsCreditNote;
  }
}

export class PagoModel {
  codFormaPago: number;
  codFormaPagoDescripcion: string;
  monto: number;
  bin: string;
  marca: string;
  codigoMarca: number;
  nroComprobanteFormaPago: number;
  cantidadCuotas: number;
  posNumeroComprobante: number;
  posCodigoAutorizacion: string;
  batchNumber: number;
  posFechaTransaccion: string;
  posFechaHoraOriginal: string;
  nroCupon: string;
  idOperacionMP: string;
  ultimos4DigitosTarjeta: string;
  TipoGateway:string;
  constructor(
    paymentMethodDescription: string,
    brand: string,
    brandCode: number,
    fee: number,
    couponNumber: string,
    idMPOperation: string,
    paymentMethodInvoiceId: number,
    price: number,
    cardLast4Numbers: string,
    gatewayType:string
  ) {
    this.codFormaPagoDescripcion = paymentMethodDescription;
    this.marca = brand;
    this.codigoMarca = brandCode;
    this.cantidadCuotas = fee;
    this.nroCupon = couponNumber;
    this.idOperacionMP = idMPOperation;
    this.nroComprobanteFormaPago = paymentMethodInvoiceId;
    this.monto = price;
    this.ultimos4DigitosTarjeta = cardLast4Numbers;
    this.TipoGateway = gatewayType;
  }
}

export class TotalesModel {
  montoLista: number;
  monto: number;
  descontado: number;
}
