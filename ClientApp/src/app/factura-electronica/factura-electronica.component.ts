import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { FacturaElectronica } from 'src/model/facturaElectronica';
import { FacturaElectronicaForm } from 'src/model/facturaElectronicaForm';
import { Sucursal } from '../sucursal/models/Sucursal';
import { AlertService } from 'src/services/alert.service';

import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FacturaElectronicaService } from './factura-electronica.service';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';

import {  AppDateAdapter,  APP_DATE_FORMATS} from 'src/app/adapters/date-adapter';

@Component({
  selector: 'app-factura-electronica',
  templateUrl: './factura-electronica.component.html',
  styleUrls: ['./factura-electronica.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class FacturaElectronicaComponent implements OnInit, OnDestroy {
  private readonly dataSubject$: Subject<void> = new Subject();
  readonly sensitiveRequired$: Subject<boolean> = new Subject();
  readonly currentBranchOffice$: Subject<number> = new Subject();
  readonly dateWindow$: Subject<number> = new Subject();

  branchOffices: Sucursal[];
  selectedFactura: FacturaElectronica = null;
  facturaList: FacturaElectronica[] = [];

  constructor(
    private readonly facturaElectronicaSvc: FacturaElectronicaService,
    private readonly spinnerSvc: SpinnerService,
    private readonly alertSvc: AlertService,
    private readonly sharedSvc: SharedService
  ) {}

  ngOnInit() {
    this.spinnerSvc.show();

    this.facturaElectronicaSvc
      .getBranchOffices()
      .pipe(
        takeUntil(this.dataSubject$),
        finalize(() => this.spinnerSvc.hide())
      )
      .subscribe(
        (res: Sucursal[]) => {
          this.populateBranchOffices(res);
          this.setSensitiveRequired();
          this.setCurrentBranchOffice();
          this.setInitialFromDate();
        },
        (error) =>
          this.alertSvc.error(
            this.facturaElectronicaSvc.resources.getSucursales.error
          )
      );
  }

  handleSubmit(form: FacturaElectronicaForm) {
    this.facturaList=[];
    this.spinnerSvc.show();
    this.facturaElectronicaSvc
      .getInvoices(form)
      .pipe(
        takeUntil(this.dataSubject$),
        finalize(() => this.spinnerSvc.hide())
      )
      .subscribe(
        (invoices: FacturaElectronica[]) => {
          if (invoices.length !== null && invoices.length > 0) {
            // Please refactor me later
            let mappedInvoices: FacturaElectronica[] = [];
            invoices.forEach((invoice: FacturaElectronica) => {
              const branchOfficeName = this.branchOffices.find(
                (sucursal: Sucursal) =>
                  Number(sucursal.numero) === invoice.NumeroSucursal
              ).nombre;

              invoice.NombreSucursal = branchOfficeName;

              mappedInvoices = [...mappedInvoices, invoice];
            });

            this.facturaList = mappedInvoices;
          } else {
            this.facturaList = [];
            this.alertSvc.info('No se encontraron comprobantes');
          }
        },
        (error) =>
          this.alertSvc.error(this.facturaElectronicaSvc.resources.getAll.error)
      );
  }

  expand(factura: FacturaElectronica) {
    this.selectedFactura = factura;
    console.warn('Current factura:');
    console.log(this.selectedFactura);
  }

  private populateBranchOffices(sucs: Sucursal[]) {
    const sortedSucs = sucs.sort((a, b) => a.numero - b.numero);

    this.branchOffices = sortedSucs;
  }

  private setCurrentBranchOffice(): void {
    this.currentBranchOffice$.next(
      this.sharedSvc.getCurrentBranchOffice().numero
    );
    this.currentBranchOffice$.complete();
  }

  private setSensitiveRequired() {
    this.sensitiveRequired$.next(this.facturaElectronicaSvc.REQUIRE_SENSITIVE);
    this.sensitiveRequired$.complete();
  }

  private setInitialFromDate() {
    this.dateWindow$.next(this.facturaElectronicaSvc.DATE_WINDOW);
    this.dateWindow$.complete();
  }

  ngOnDestroy() {
    this.dataSubject$.next();
    this.dataSubject$.complete();
  }
}
