import { Injectable } from '@angular/core';
import { TicketModelDto } from '../datos-delivery/dto/ticketModelDto';
import { Adapter } from './adapter';
import { Ticket } from '../datos-delivery/Models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketAdapter implements Adapter<Ticket> {
  adapt(ticketModel: TicketModelDto): Ticket {
    return new Ticket(
      ticketModel.idSucursal,
      ticketModel.nroCaja,
      ticketModel.nroComprobante,
      ticketModel.nroApertura,
      ticketModel.tipoComprobante,
      ticketModel.fechaDeTrabajo,
      ticketModel.nroSolicitud,
      ticketModel.pagos[0].codFormaPagoDescripcion,
      ticketModel.pagos[0].marca,
      ticketModel.pagos[0].codigoMarca,
      ticketModel.pagos[0].cantidadCuotas,
      ticketModel.totales.monto,
      ticketModel.pagos[0].nroComprobanteFormaPago,
      ticketModel.pagos[0].idOperacionMP,
      ticketModel.pagos[0].ultimos4DigitosTarjeta,
      ticketModel.pagos[0].nroCupon,
      ticketModel.sinDatos,
      ticketModel.tipoGateway,
      ticketModel.contieneNC
    );
  }
}
