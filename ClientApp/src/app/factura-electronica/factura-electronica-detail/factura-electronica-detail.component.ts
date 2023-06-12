import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { FacturaElectronicaService } from '../factura-electronica.service';
import { AlertService } from 'src/services/alert.service';
import { ModalService } from 'src/services/modal.service';
import { MatTableDataSource } from '@angular/material';

import { FacturaDetails } from 'src/model/facturaDetails';
import { FacturaElectronica, EstadoAFIP } from 'src/model/facturaElectronica';

import { ModalForwardComponent } from '../modal-forward/modal-forward.component';

@Component({
  selector: 'app-factura-electronica-detail',
  templateUrl: './factura-electronica-detail.component.html',
  styleUrls: ['./factura-electronica-detail.component.css'],
})
export class FacturaElectronicaDetailComponent implements OnInit {
  @Input() factura: FacturaElectronica;
  @Output() clearFactura = new EventEmitter();

  public EstadoAFIP = EstadoAFIP;
  public dataSource: MatTableDataSource<FacturaDetails>;

  public displayedColumns: string[] = [
    'Sku',
    'Nombre',
    'Unidades',
    'PrecioUnitario',
    'PrecioTotal',
    'Descuento',
    'PrecioTotalDescuento',
  ];

  constructor(
    private facturaElectronicaSvc: FacturaElectronicaService,
    private modalSvc: ModalService,
    private alertSvc: AlertService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.factura.Detalles);
  }

  public clear() {
    this.factura = null;
    this.clearFactura.emit(null);
  }

  public download() {
    this.alertSvc.info('Descargando..');

    this.facturaElectronicaSvc
      .getInvoicePdf(this.factura)
      .pipe(take(1))
      .subscribe(
        (success) => {
          this.alertSvc.success('Comprobante descargado satisfactoriamente');
        },
        (error) => {
          this.alertSvc.error(
            'Ocurrió un error en la descarga del comprobante'
          );
        }
      );
  }

  public handleForward() {
    const dialogRef = this.modalSvc.open(ModalForwardComponent, {
      height: 'auto',
      width: '500px',
      data: {
        email: this.factura.Email,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((email: string) => {
        if (email !== null && email !== '') {
          this.alertSvc.info('Reenviando comprobante..');

          this.facturaElectronicaSvc
            .forwardInvoice(this.factura.CAE, email)
            .pipe(take(1))
            .subscribe(
              (success) =>
                this.alertSvc.success(
                  this.facturaElectronicaSvc.resources.forward.success
                ),

              (error) =>
                this.alertSvc.error(
                  this.facturaElectronicaSvc.resources.forward.error
                )
            );
        }
      });
  }
}
