// import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Ticket } from './Models/ticket.model';
import {
  FormArray,
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropdownOptions } from './Models/dropdownOptions.model';
import { DropdownOptionsAdapter } from '../adapters/dropdownOptions-adapter';
import { TicketModelDtoAdapter } from '../adapters/ticketModelDto-adapter';
import { TicketAdapter } from '../adapters/ticketModel-adapter';
import { Filters } from './Models/filters.model';
import { Item } from './Models/item.model';
import { ItemAdapter } from '../adapters/item-adapter';
import { ItemModelDto } from './dto/itemModelDto';
import { Constants } from '../shared/Constants';
import { SettingsService } from 'src/services/settings.service';
import { paymentMethodCardModel } from './Models/paymentMethodCard.model';
import { Sort } from '@angular/material/sort';
import { ComparerService } from '../shared/services/comparer.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  delivery = 'v1/delivery/';
  urlApi: string;
  urlApiWithOfficeId: string;
  private headers = new HttpHeaders();

  constructor(
    private _http: HttpClient,
    private _ticketAdapter: TicketAdapter,
    private _ticketModelDtoAdapter: TicketModelDtoAdapter,
    private _dropdownOptionsAdapter: DropdownOptionsAdapter,
    private _itemAdapter: ItemAdapter,
    private _settings: SettingsService,
    private comparerService: ComparerService
  ) {
    console.log('ticketService settings: ', this._settings.apiOmnicanal);
    this.urlApiWithOfficeId = this._settings.getUrlWithOfficeId();
    this.setHeaders();
  }

  private setHeaders(): void {
    this.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'
    );
    this.headers.set('Content-Type', 'application/json');
  }

  getTickets(filters: Filters): Observable<Ticket[]> {
    let url = `${this._settings.getUrlWithOfficeId()}${
      this.delivery
    }getTickets?`;

    url = this._addQueryParams(url, filters);

    return this._http
      .get<Ticket[]>(url, { headers: this.headers })
      .pipe(
        map((data: any[]) =>
          data.map((ticket) => this._ticketAdapter.adapt(ticket))
        )
      );
  }

  getPendingTickets(): Observable<number> {
    const url = `${this._settings.getUrlWithOfficeId()}${
      this.delivery
    }getPendingTickets/${this._settings.branchOffice}`;

    return this._http
      .get<number>(url, { headers: this.headers })
      .pipe(map((data: number) => data));
  }

  private setValueForBrandSelect(form: FormGroup): void {
    let brandControl =
      form.controls[Constants.delivery.formData.controls.brand];
    let brandValue: paymentMethodCardModel = brandControl.value;
    brandControl.setValue(brandValue.descripcion);
  }

  getTicketsWithFilterAsFormArray(filters: Filters): Observable<FormArray> {
    return this.getTickets(filters).pipe(
      map((tickets: Ticket[]) => {
        //mapea todos los tickets a un formgroup
        let fgs: FormGroup[] = [];
        tickets.map((t) => {
          let form = this._asFormGroup(t);
          this.setValueForBrandSelect(form);
          fgs.push(form);
        });
        return new FormArray(fgs);
      })
    );
  }

  getItems(ticket: Ticket): Observable<Item[]> {
    var date = this._removeTime(ticket.workDate);

    const url = `${this._settings.getUrlWithOfficeId()}${
      this.delivery
    }getItems/${ticket.branchOffice}/${ticket.pointOfSale}/${
      ticket.openingNumber
    }/${ticket.invoiceType}/${ticket.invoiceId}/${date}`;

    console.log('url: ', url);

    return this._http
      .get<Item[]>(url, { headers: this.headers })
      .pipe(
        map((data: any[]) =>
          data.map((item: ItemModelDto) => this._itemAdapter.adapt(item))
        )
      );
  }

  private _removeTime(workDate: string) {
    return workDate.slice(0, 10);
  }

  getDropdownOptions(): Observable<DropdownOptions> {
    const url =
      this._settings.getUrlWithOfficeId() +
      this.delivery +
      'getDropdownOptions';
    return this._http
      .get<DropdownOptions>(url, { headers: this.headers })
      .pipe(map((data: any) => this._dropdownOptionsAdapter.adapt(data)));
  }

  updateTicket(ticket: Ticket, userAD: string) {
    console.log('updateTicket');
    console.log(ticket);
    const url =
      this._settings.getUrlWithOfficeId() +
      this.delivery +
      'updateTicket/' +
      userAD;

    const ticketDto = this._ticketModelDtoAdapter.adapt(ticket);
    console.log(ticketDto);
    return this._http.post(url, ticketDto, { headers: this.headers });
  }

  private _asFormGroup(ticket: Ticket): FormGroup {
    const formGroup = new FormGroup({
      branchOffice: new FormControl(ticket.branchOffice),
      pointOfSale: new FormControl({
        value: ticket.pointOfSale,
        disabled: 'true',
      }),
      workDate: new FormControl({ value: ticket.workDate, disabled: 'true' }),
      invoiceId: new FormControl(ticket.invoiceId),
      openingNumber: new FormControl(ticket.openingNumber),
      invoiceType: new FormControl(ticket.invoiceType),
      noData: new FormControl(ticket.noData),
      applicationNumber: new FormControl(
        ticket.applicationNumber,
        Validators.required
      ),
      paymentMethod: new FormControl(ticket.paymentMethod, Validators.required),
      brand: new FormControl(ticket.brand),
      fee: new FormControl(ticket.fee),
      couponNumber: new FormControl(ticket.couponNumber),
      price: new FormControl({ value: ticket.price, disabled: 'true' }),
      cardLast4Numbers: new FormControl(ticket.cardLast4Numbers),
      idMPOperation: new FormControl(ticket.idMPOperation),
      paymentMethodInvoiceId: new FormControl(ticket.paymentMethodInvoiceId),
      containsCreditNote: new FormControl(ticket.containsCreditNote),
    });
    formGroup.setValidators(this._validator());
    return formGroup;
  }

  private _validator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const noDataControl =
        group.controls[Constants.delivery.formData.controls.noData];
      const paymentMethodControl =
        group.controls[Constants.delivery.formData.controls.paymentMethod];
      const cardLast4NumbersControl =
        group.controls[Constants.delivery.formData.controls.cardLast4Numbers];
      const couponNumberControl =
        group.controls[Constants.delivery.formData.controls.couponNumber];
      const brandControl =
        group.controls[Constants.delivery.formData.controls.brand];
      const feeControl =
        group.controls[Constants.delivery.formData.controls.fee];
      const idMPOperationControl =
        group.controls[Constants.delivery.formData.controls.idMPOperation];
      const applicationNumberControl =
        group.controls[Constants.delivery.formData.controls.applicationNumber];

      if (noDataControl.value) {
        idMPOperationControl.validator = null;
        cardLast4NumbersControl.validator = null;
        couponNumberControl.validator = null;
        brandControl.validator = null;
        feeControl.validator = null;
      } else {
        if (
          paymentMethodControl.value == Constants.delivery.paymentMethods.credit
        ) {
          cardLast4NumbersControl.validator = Validators.required;
          couponNumberControl.validator = Validators.required;
          brandControl.validator = Validators.required;
          feeControl.validator = Validators.required;
          idMPOperationControl.validator = null;
        } else if (
          paymentMethodControl.value == Constants.delivery.paymentMethods.debit
        ) {
          cardLast4NumbersControl.validator = Validators.required;
          couponNumberControl.validator = Validators.required;
          brandControl.validator = Validators.required;
          feeControl.validator = null;
          idMPOperationControl.validator = null;
        } else if (
          paymentMethodControl.value ==
          Constants.delivery.paymentMethods.mercadoPago
        ) {
          idMPOperationControl.validator = Validators.required;
          cardLast4NumbersControl.validator = null;
          couponNumberControl.validator = null;
          brandControl.validator = null;
          feeControl.validator = null;
        } else {
          idMPOperationControl.validator = null;
          cardLast4NumbersControl.validator = null;
          couponNumberControl.validator = null;
          brandControl.validator = null;
          feeControl.validator = null;
        }
      }
      return;
    };
  }

  private _addQueryParams(url: string, filters: Filters): string {
    let pointOfSale = '';
    let paymentMethod = '';
    let brand = '';
    let startingDate = '';
    let endingDate = '';
    const pendingData = 'pendingData=' + filters.pendingData;
    const branchOffice = 'branchOffice=' + this._settings.branchOffice;

    this._isEmptyOrAll(filters.pointOfSale.toString())
      ? (pointOfSale = 'pointOfSale=' + filters.pointOfSale)
      : '';
    this._isEmptyOrAll(filters.paymentMethod)
      ? (paymentMethod = 'paymentMethod=' + filters.paymentMethod)
      : '';
    this._isEmptyOrAll(filters.brand) ? (brand = 'brand=' + filters.brand) : '';
    this._isEmptyOrAll(filters.startingDate.toString())
      ? (startingDate = 'startingDate=' + filters.startingDate)
      : '';
    this._isEmptyOrAll(filters.endingDate.toString())
      ? (endingDate = 'endingDate=' + filters.endingDate)
      : '';

    if (this._isEmptyOrAll(pointOfSale)) {
      url += pointOfSale;
    }
    if (this._isEmptyOrAll(paymentMethod)) {
      url += this._isEmptyOrAll(pointOfSale) ? '&' : '';
      url += paymentMethod;
    }
    if (this._isEmptyOrAll(brand)) {
      url +=
        this._isEmptyOrAll(pointOfSale) || this._isEmptyOrAll(paymentMethod)
          ? '&'
          : '';
      url += brand;
    }
    if (this._isEmptyOrAll(startingDate)) {
      url +=
        this._isEmptyOrAll(pointOfSale) ||
        this._isEmptyOrAll(paymentMethod) ||
        this._isEmptyOrAll(brand)
          ? '&'
          : '';
      url += startingDate;
    }
    if (this._isEmptyOrAll(endingDate)) {
      url +=
        this._isEmptyOrAll(pointOfSale) ||
        this._isEmptyOrAll(paymentMethod) ||
        this._isEmptyOrAll(brand) ||
        this._isEmptyOrAll(startingDate)
          ? '&'
          : '';
      url += endingDate;
    }
    url +=
      this._isEmptyOrAll(pointOfSale) ||
      this._isEmptyOrAll(paymentMethod) ||
      this._isEmptyOrAll(brand) ||
      this._isEmptyOrAll(startingDate)
        ? '&'
        : '';
    url += pendingData;
    url += '&';
    url += branchOffice;

    console.log(url);

    return url;
  }

  private _isEmptyOrAll(filter: string) {
    return filter != '0' && filter.length != 0;
  }

  public async getFechaTrabajo(): Promise<string> {
    return this._http
      .get<string>(
        `${this._settings.getUrlWithOfficeId()}${this.delivery}getFechaTrabajo`,
        { headers: this.headers }
      )
      .toPromise();
  }

  public buildTicketFromFormGroup(ticketForm: FormGroup): Ticket {
    let ticket: Ticket = ticketForm.getRawValue();
    let ticketToUpdate = new Ticket(
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
      ticket.price,
      ticket.paymentMethodInvoiceId,
      ticket.idMPOperation,
      ticket.cardLast4Numbers,
      ticket.couponNumber,
      ticket.noData,
      ticket.gatewayType,
      ticket.containsCreditNote
    );
    return ticketToUpdate;
  }

  public getUsuarioByUsuarioAD(user: string): Observable<string> {
    let url = `${this._settings.getUrlWithOfficeId()}${
      this.delivery
    }getUsuarioByUserAD?user=${user}`;
    return this._http.get<string>(url, { headers: this.headers });
  }

  public sortTicketsFormGroup(formGroups: AbstractControl[], sort: Sort) {
    let isAsc = sort.direction === 'asc' ? true : false;
    formGroups.sort((a: FormGroup, b: FormGroup) => {
      let elementA = a.controls[sort.active].value;
      let elementB = b.controls[sort.active].value;
      switch (sort.active) {
        case Constants.delivery.formData.columns.pointOfSale:
        case Constants.delivery.formData.columns.cardLast4Numbers:
        case Constants.delivery.formData.columns.price:
        case Constants.delivery.formData.columns.couponNumber:
        case Constants.delivery.formData.columns.fee:
        case Constants.delivery.formData.columns.idMPOperation:
        case Constants.delivery.formData.columns.applicationNumber:
        case Constants.delivery.formData.columns.containsCreditNote:
          return this.comparerService.compararNumeros(
            Number(elementA),
            Number(elementB),
            isAsc
          );
        case Constants.delivery.formData.columns.workDate:
          return this.comparerService.compararFechas(
            new Date(elementA),
            new Date(elementB),
            isAsc
          );
        case Constants.delivery.formData.columns.paymentMethod:
        case Constants.delivery.formData.columns.brand:
          return this.comparerService.compararStrings(
            elementA,
            elementB,
            isAsc
          );
        default:
          return 0;
      }
    });
  }
}
