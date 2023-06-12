import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { take } from 'rxjs/operators';
import { FacturaElectronica, EstadoAFIP } from 'src/model/facturaElectronica';
import { FacturaElectronicaService } from '../factura-electronica.service';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-factura-electronica-tbl',
  templateUrl: './factura-electronica-tbl.component.html',
  styleUrls: ['./factura-electronica-tbl.component.css'],
})
export class FacturaElectronicaTblComponent implements OnChanges {
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Output() factura = new EventEmitter<FacturaElectronica>();
  @Input() facturaList: FacturaElectronica[];

  public dataSource: MatTableDataSource<FacturaElectronica>;
  public EstadoAFIP = EstadoAFIP;
  public pageSize = 10;
  public pageEvent: PageEvent;

  public displayedColumns: string[];

  constructor(
    private facturaElectronicaSvc: FacturaElectronicaService,
    private alertSvc: AlertService
  ) {
    this.displayedColumns = [
      'FechaEmision',
      'NumeroSucursal',
      'NombreSucursal',
      'Tipo',
      'Total',
      'DNI',
      'Email',
      'Estado',
      'Acciones',
      
    ];
  }


  ngOnChanges() {

    this.dataSource = new MatTableDataSource(     
      this.facturaList
        .sort((a, b) => a.FechaEmision.getTime() - b.FechaEmision.getTime())

    );
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // <-- Data table actions START -->

  /**
   * Descarga una factura electronica en base a un id
   * @param factura FacturaElectronica
   */
  download(factura: FacturaElectronica): void {
    this.alertSvc.info('Descargando..');

    this.facturaElectronicaSvc
      .getInvoicePdf(factura)
      .pipe(take(1))
      .subscribe(
        (success) =>
          this.alertSvc.success(
            this.facturaElectronicaSvc.resources.download.success
          ),
        (error) =>
          this.alertSvc.error(
            this.facturaElectronicaSvc.resources.download.error
          )
      );
  }

  /**
   * Muestra los detalles de una factura electronica en base a un id
   * @param factura FacturaElectronica
   */
  expand(f: FacturaElectronica): void {
    this.factura.emit(f);
  }

  // <-- Data table actions END -->
}
