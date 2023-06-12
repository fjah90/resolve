import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SettingsService } from 'src/services/settings.service';
import { ResourceService } from 'src/services/resource.service';
import { FacturaElectronica } from 'src/model/facturaElectronica';
import { Invoice } from 'src/model/invoice';

import { saveAs } from 'file-saver';
import { FacturaElectronicaForm } from 'src/model/facturaElectronicaForm';
import { Sucursal } from '../sucursal/models/Sucursal';
import { Endpoint } from 'src/model/config-file.model';

@Injectable({
  providedIn: 'root',
})
export class FacturaElectronicaService {
  private readonly FEC_ENDPOINT: Endpoint;
  readonly REQUIRE_SENSITIVE: boolean;
  readonly DATE_WINDOW: number;
  private headers = new HttpHeaders();

  readonly resources: any = null;

  constructor(
    private readonly http: HttpClient,
    private readonly settingsSvc: SettingsService,
    private readonly resourceSvc: ResourceService
  ) {
    // tslint:disable-next-line: no-string-literal
    this.FEC_ENDPOINT = this.settingsSvc.config.endpoints['fec'];


    this.REQUIRE_SENSITIVE = this.settingsSvc.config.sensitiveRequired;
    this.DATE_WINDOW = this.settingsSvc.config.dateWindow;
    this.resources = this.resourceSvc.resources.facturaElectronica;
  }

  public getBranchOffices(): Observable<Sucursal[]> {

    const reqHeaders = this.setUpHeaders(this.FEC_ENDPOINT.key);

    return this.http
      .get<Sucursal[]>(
        `${this.settingsSvc.getUrlWithOfficeId()}v1/omnicanal/obtenerSucursales`,
        { headers: reqHeaders }
      )
      .pipe(catchError(this.errorHandler));
  }

  /**
   * Devuelve un pdf con el comprobante solicitado
   * @param factura FacturaElectronica - El comprobante a procesar
   */
  public getInvoicePdf(factura: FacturaElectronica): Observable<void> {
    const reqHeaders = this.setUpHeaders(this.FEC_ENDPOINT.key);

    // !!! IMPORTANTE !!!
    // Esto se actualizó debido a un cambio de lógica en la obtención del pdf en el endpoint getPdf()
    // Cuidado al hacer el merge contra develop
    return this.http
      .get(
        `${this.FEC_ENDPOINT.uri}/api/headquarter/sync/invoices/${factura.CAE}/pdf`,
        { headers: reqHeaders, responseType: 'blob' }
      )
      .pipe(
        catchError(this.errorHandler),
        tap((res: any) => {
          saveAs(res, `Factura-${factura.Numero}-${factura.NumeroSucursal}`);
        })
      );
  }

  /**
   * Reenvía el comprobante a un email específico
   */
  public forwardInvoice(cae: number, email: string): Observable<void> {
    const reqHeaders = this.setUpHeaders(this.FEC_ENDPOINT.key);

    return this.http
      .get<void>(
        `${this.FEC_ENDPOINT.uri}/api/invoice/email/resend/${cae}/${email}`,
        { headers: reqHeaders }
      )
      .pipe(catchError(this.errorHandler));
  }

  public getInvoices(
    form: FacturaElectronicaForm
  ): Observable<FacturaElectronica[]> {
    const reqHeaders = this.setUpHeaders(this.FEC_ENDPOINT.key);
    let reqParams: HttpParams = new HttpParams();

    // Genera un nuevo param por cada filtro
    Object.keys(form).forEach((prop) => {
      if (form[prop] !== null) {
        reqParams = reqParams.set(prop, form[prop]);
      }
    });

    return this.http
      .get<Invoice[]>(
        `${this.FEC_ENDPOINT.uri}/api/headquarter/sync/invoices`,
        {
          headers: reqHeaders,
          params: reqParams,
        }
      )
      .pipe(
        catchError(this.errorHandler),
        map((res: Invoice[]) =>
          res.map(
            (invoice: Invoice) =>
              new FacturaElectronica(
                invoice.InvoiceNumberFrom,
                invoice.IdNumber,
                invoice.Total,
                invoice.SubtotalWithDiscounts,
                invoice.Discounts,
                invoice.Cae,
                invoice.CaeExpiration,
                invoice.BranchOffice,
                invoice.PointOfSale,
                invoice.CustomerEmail,
                invoice.ClientFullName,
                invoice.InvoiceGenerationDate,
                invoice.AfipInvoiceType,
                invoice.Error,
                invoice.ErrorMessage,
                invoice.InvoiceID,
                invoice.Items
              )
          )
        )
      );
  }

  private setUpHeaders(key: string) {
    this.headers = new HttpHeaders();
    this.headers.set( 'Cache-Control', 'no-cache, no-store, must-revalidate, post- check=0, pre-check=0');
    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('api-key',key);

    return this.headers;
  }

  private errorHandler(err: any) {
    if (err != null) {
      console.error(`URL: ${err.url}`);
      console.error(`STATUS: ${err.status} - ${err.statusCode}`);
    }

    return throwError(err.error);
  }
}
