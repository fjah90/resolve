import { Adapter } from './adapter';
import { Injectable } from '@angular/core';
import { TicketModelDto } from '../datos-delivery/dto/ticketModelDto';
import { Ticket } from '../datos-delivery/Models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketModelDtoAdapter implements Adapter<TicketModelDto> {
  adapt(ticket: Ticket): TicketModelDto {
    return new TicketModelDto(
      ticket.branchOffice,
      ticket.pointOfSale,
      ticket.invoiceId,
      ticket.openingNumber,
      ticket.invoiceType,
      ticket.workDate,
      ticket.applicationNumber,
      ticket.paymentMethod,
      ticket.brand.descripcion,
      ticket.brand.codigo,
      ticket.fee,
      ticket.couponNumber,
      ticket.idMPOperation,
      ticket.paymentMethodInvoiceId,
      ticket.price,
      ticket.cardLast4Numbers,
      ticket.noData,
      ticket.gatewayType,
      ticket.containsCreditNote
    );
  }
}
