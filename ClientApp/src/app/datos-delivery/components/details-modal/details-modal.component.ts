import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { SpinnerService } from 'src/services/spinner.service';
import { TicketService } from '../../ticket.service';
import { Ticket } from '../../Models/ticket.model';
import { AlertService } from 'src/services/alert.service';
import { ItemModelDto } from '../../dto/itemModelDto';
import { Item } from '../../Models/item.model';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.css'],
})
export class DetailsModalComponent implements OnInit {
  displayedColumns: string[] = ['barcode', 'cuf', 'description', 'amount'];
  ticket: Ticket;
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private spinner: SpinnerService,
    private _ticketService: TicketService,
    private alert: AlertService,
    private dialogRef: MatDialogRef<DetailsModalComponent>
  ) {
    this.ticket = data;
    console.log('ticket: ', this.ticket);
  }

  ngOnInit() {
    this._getItems();
  }

  private _getItems() {
    this.spinner.show();
    this._ticketService.getItems(this.ticket).subscribe(
      (items: Item[]) => {
        this.spinner.hide();
        console.log('response get items: ', items);
        if (items.length == 0) {
          this.alert.error(
            'Hubo un error buscando los items, intente nuevamente'
          );
          this.dialogRef.close();
        }
        this.dataSource = new MatTableDataSource(items);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.alert.success('Se ha guardado el comprobante de forma exitosa');
        // formGroup.markAsPristine()
      },
      (errorResponse) => {
        this.spinner.hide();
        this.dialogRef.close();
        this.alert.error(
          'Hubo un error buscando los items, intente nuevamente'
        );
      }
    );
  }
}
