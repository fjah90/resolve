import { Component, Inject, Optional, TemplateRef, ViewChild } from '@angular/core';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatCheckboxChange,
  MatDialog,
  MatDialogConfig,
  Sort,
} from '@angular/material';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/adapters/date-adapter';
import { DatePipe, formatDate } from '@angular/common';
import { AlertService } from 'src/services/alert.service';
import { ModalService } from 'src/services/modal.service';
import { SpinnerService } from 'src/services/spinner.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { TicketService } from '../ticket.service';
import { User } from 'src/model/user';
import { DetailsModalComponent } from '../components/details-modal/details-modal.component';
import { Constants } from 'src/app/shared/Constants';
import { FormFiltersDelivery } from 'src/app/shared/constants/form.filters.delivery';
import { paymentMethodCardModel } from '../Models/paymentMethodCard.model';

@Component({
  selector: 'app-admin-datos-delivery',
  templateUrl: './admin-datos-delivery.component.html',
  styleUrls: ['./admin-datos-delivery.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AdminDatosDeliveryComponent {
  isResultadoBusquedaEmpty = false;
  startingDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy').toString();
  endingDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy').toString();
  paymentMethod = '';
  synchronizationDate = '';
  displayedColumns: string[] = [
    Constants.delivery.formData.columns.pointOfSale,
    Constants.delivery.formData.columns.workDate,
    Constants.delivery.formData.columns.noData,
    Constants.delivery.formData.columns.applicationNumber,
    Constants.delivery.formData.columns.paymentMethod,
    Constants.delivery.formData.columns.brand,
    Constants.delivery.formData.columns.fee,
    Constants.delivery.formData.columns.couponNumber,
    Constants.delivery.formData.columns.price,
    Constants.delivery.formData.columns.cardLast4Numbers,
    Constants.delivery.formData.columns.idMPOperation,
    Constants.delivery.formData.columns.save,
    Constants.delivery.formData.columns.detail    
  ];
  formFiltersDelivery: FormGroup;
  formDataTable: FormGroup;
  control: FormArray;
  dataSource = new MatTableDataSource();
  isLoading: boolean;
  dateDefault: string;
  cmbPointsOfSale: number[] = [];
  cmbPaymentsMethod: string[] = [];
  cmbBrands: string[] = [];
  cmbPaymentCards: Array<paymentMethodCardModel> = new Array<paymentMethodCardModel>();
  paymentCardsDebit: Array<paymentMethodCardModel> = new Array<paymentMethodCardModel>();
  paymentCardsCredit: Array<paymentMethodCardModel> = new Array<paymentMethodCardModel>();
  pendingTickets: number = 0;
  constants = Constants;
  formFiltersDeliveryConstants = FormFiltersDelivery;
  private fechaTrabajo: string;
  public cuotas: Array<Number> = new Array();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('creditNoteDialog',{static: true}) creditNoteDialog: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private spinner: SpinnerService,
    public modalService: ModalService,
    private datepipe: DatePipe,
    private alert: AlertService,
    private _ticketService: TicketService,
    public userAD: User,
    public dialog: MatDialog,
    public dialogNC: MatDialog,
    @Optional() public dialogNCData: FormGroup
  ) {}

  ngOnInit() {
    this.loadInitialConfigurations();
    this.setFormFilters();
    this.setFormDataTable();
    this._getPendingTickets();
    this.setDateFiltersWithWorkDate();
  }

  public onSortData(sort: Sort): void {
    if (sort.direction && sort.active) {
      let tickets = this.formDataTable.get(
        Constants.delivery.formData.controls.tickets
      ) as FormArray;
      let formGroups = tickets.controls;

      if(sort.active === Constants.delivery.formData.columns.save){
        sort.active = Constants.delivery.formData.columns.containsCreditNote;
        sort.direction = sort.direction == 'asc' ? 'desc' : 'asc'
      }

      this._ticketService.sortTicketsFormGroup(formGroups, sort);
    }
  }

  openModalDetail(formGroup: FormGroup) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = formGroup.getRawValue();
    dialogConfig.width = '1000px';
    this.dialog.open(DetailsModalComponent, dialogConfig);
  }

  setFormFilters() {
    this.formFiltersDelivery = this.fb.group({
      pointOfSale: '',
      brand: '',
      startingDate: '',
      endingDate: '',
      paymentMethod: '',
      pendingData: false,
    });
    this.setValidatorsForDatesInput();
  }

  private setValidatorsForDatesInput() {
    let startingDate = this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.startingDate
    ];
    let endingDate = this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.endingDate
    ];
    startingDate.setValidators(Validators.required);
    endingDate.setValidators(Validators.required);
    startingDate.markAsUntouched();
    endingDate.markAsUntouched();
  }

  setFormDataTable() {
    this.formDataTable = this.fb.group({
      tickets: this.fb.array([]),
    });

    this.isResultadoBusquedaEmpty = false;
    this.search(this.formFiltersDelivery, true);
  }

  cleanFilters() {
    this.setFormFilters();
    this.setDateFiltersWithWorkDate();
    this.search(this.formFiltersDelivery, true);
  }

  public dateBlur(event, control: AbstractControl) {
    if (!event.value) {
      control.markAsUntouched();
    }
  }

  private validateEmptyDateFields(): boolean {
    let startDate = this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.startingDate
    ];
    let endDate = this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.endingDate
    ];
    let result: boolean;
    if (!startDate.value || !endDate.value) {
      if (!startDate.value) {
        startDate.markAsTouched();
      }
      if (!endDate.value) {
        endDate.markAsTouched();
      }
      result = false;
    } else {
      result = true;
    }
    return result;
  }

  search(filtersForm: FormGroup, callbyinit: boolean = false) {
    if (!callbyinit && !this.validateEmptyDateFields()) {
      return;
    }

    this.spinner.show();
    this._ticketService.getUsuarioByUsuarioAD(this.userAD.userAD).subscribe(
      async (user) => {
        console.log('filtersForm', filtersForm.getRawValue());
        await this.getFechaTrabajo();
        this._ticketService
          .getTicketsWithFilterAsFormArray(filtersForm.getRawValue())
          .subscribe(
            (response: FormArray) => {
              console.log('response search: ', response);
              this._getPendingTickets();
              this._setFormDataTable(response);
              this.spinner.hide();
            },
            (errorResponse) => {
              this.spinner.hide();
              this.isResultadoBusquedaEmpty = false;
              this.alert.error('Hubo un error, intente nuevamente');
            }
          );
      },
      (error) => {
        this.spinner.hide();
        this.alert.error(error.error.message);
      }
    );
  }

  private _setFormDataTable(tickets) {

    if (tickets.length === 0) {
      this.isResultadoBusquedaEmpty = true;

      this.formDataTable.setControl(
        Constants.delivery.formData.controls.tickets,
        tickets
      );

      this.dataSource = new MatTableDataSource();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      return;
    }

    this.isResultadoBusquedaEmpty = false;

    this.formDataTable.setControl(
      Constants.delivery.formData.controls.tickets,
      tickets
    );

    (this.formDataTable.controls[
      Constants.delivery.formData.controls.tickets
    ] as FormArray).controls.map((formGroup: FormGroup) => {
      this.enableCorrespondingFields(formGroup);
    });

    this.dataSource = new MatTableDataSource(
      (this.formDataTable.get(
        Constants.delivery.formData.controls.tickets
      ) as FormArray).controls
    );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setPaymentMethod(eventValue, formGroup: FormGroup) {
    this.cleanFields(formGroup);
    this.enableCorrespondingFields(formGroup);
    this.updateValidators(formGroup);
  }

  private async getFechaTrabajo(): Promise<void> {
    try {
      this.fechaTrabajo = await this._ticketService.getFechaTrabajo();
    } catch (error) {
      this.alert.error(
        'Ocurrio un error al intentar obtener la fecha de trabajo'
      );
    }
    return;
  }

  private enableCorrespondingFields(formGroup: FormGroup) {

    const noDataControl = formGroup.controls[Constants.delivery.formData.controls.noData];

    const workDateControl = formGroup.controls[Constants.delivery.formData.controls.workDate];

    let a = formGroup.controls[Constants.delivery.formData.controls.containsCreditNote];

    if(formGroup.controls[Constants.delivery.formData.controls.containsCreditNote].value){
      this._disableContainsCreditNote(formGroup);
      return;
    }

    //si no es de la misma fecha debe estar deshabilitado
    if (
      new Date(workDateControl.value).toString() !==
      new Date(this.fechaTrabajo).toString()
    ) {
      this._disableAll(formGroup);
      return;
    }

    if (noDataControl.value) {
      this._disableNoData(formGroup);
      return;
    }

    let paymentType =
      formGroup.controls[Constants.delivery.formData.controls.paymentMethod]
        .value;
    if (this.isDebit(paymentType)) {
      this.enableDebitCardData(formGroup);
    } else if (this.isCredit(paymentType)) {
      this.enableCreditCardData(formGroup);
    } else if (this.isMercadoPago(paymentType)) {
      this.enableMercadoPagoData(formGroup);
      this.disableCreditDebitCardData(formGroup);
    } else {
      this.disableCreditDebitCardData(formGroup);
      this.disableMercadoPagoData(formGroup);
    }
  }

  private isDebit(value): boolean {
    return value === Constants.delivery.paymentMethods.debit;
  }

  private isCredit(value): boolean {
    return value === Constants.delivery.paymentMethods.credit;
  }

  private isMercadoPago(value): boolean {
    return value === Constants.delivery.paymentMethods.mercadoPago;
  }

  /// TO DO: Mover todo el tema de las validaciones sobre el formulario a un servicio nuevo que se encargue solo del formulario de delivery
  private cleanFields(formGroup: FormGroup) {
    formGroup.controls[Constants.delivery.formData.controls.brand].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.brand
    ].markAsUntouched();
    formGroup.controls[Constants.delivery.formData.controls.fee].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.fee
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].markAsUntouched();
  }

  private disableCreditDebitCardData(formGroup: FormGroup) {
    formGroup.controls[Constants.delivery.formData.controls.brand].setValue('');
    formGroup.controls[Constants.delivery.formData.controls.brand].disable();
    formGroup.controls[Constants.delivery.formData.controls.fee].setValue('');
    formGroup.controls[Constants.delivery.formData.controls.fee].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].disable();
  }

  private disableMercadoPagoData(formGroup: FormGroup) {
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].disable();
  }

  private enableCreditCardData(formGroup: FormGroup) {
    formGroup.controls[Constants.delivery.formData.controls.brand].enable();
    formGroup.controls[Constants.delivery.formData.controls.fee].enable();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].enable();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].enable();
    this.disableMercadoPagoData(formGroup);
  }

  private enableDebitCardData(formGroup: FormGroup) {
    formGroup.controls[Constants.delivery.formData.controls.brand].enable();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].enable();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].enable();
    formGroup.controls[Constants.delivery.formData.controls.fee].disable();
    this.disableMercadoPagoData(formGroup);
  }

  private _disableAll(formGroup) {

    Object.keys(formGroup.controls).forEach(element => {      
      formGroup.controls[element].disable();      
    });

  }

  private _disableContainsCreditNote(formGroup) {
    
    Object.keys(formGroup.controls).forEach(element => {
      if(formGroup.controls[element].value == undefined){        
        formGroup.controls[element].setValue('');
      }
    });

    this._disableAll(formGroup);
  }

  private _disableNoData(formGroup: FormGroup) {
    formGroup.controls[Constants.delivery.formData.controls.brand].setValue('');
    formGroup.controls[Constants.delivery.formData.controls.brand].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.brand
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].markAsUntouched();
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].setValue('');
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].markAsUntouched();
    formGroup.controls[Constants.delivery.formData.controls.fee].setValue('');
    formGroup.controls[Constants.delivery.formData.controls.fee].disable();
    formGroup.controls[
      Constants.delivery.formData.controls.fee
    ].markAsUntouched();
  }

  private enableMercadoPagoData(formGroup: FormGroup) {
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].enable();
  }

  updateValidators(formGroup: FormGroup) {
    formGroup.controls[
      Constants.delivery.formData.controls.idMPOperation
    ].updateValueAndValidity();
    formGroup.controls[
      Constants.delivery.formData.controls.cardLast4Numbers
    ].updateValueAndValidity();
    formGroup.controls[
      Constants.delivery.formData.controls.couponNumber
    ].updateValueAndValidity();
    formGroup.controls[
      Constants.delivery.formData.controls.brand
    ].updateValueAndValidity();
    formGroup.controls[
      Constants.delivery.formData.controls.fee
    ].updateValueAndValidity();
  }
  noDataChange(event: MatCheckboxChange, formGroup: FormGroup) {
    if (event.checked) {
      this._disableNoData(formGroup);
    } else {
      this.enableCorrespondingFields(formGroup);
    }
  }

  private buildCuotasArray(): void {
    for (let index = 1; index <= 24; index++) {
      this.cuotas.push(index);
    }
  }

  private async setDateFiltersWithWorkDate(): Promise<void> {
    await this.getFechaTrabajo();
    this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.startingDate
    ].setValue(formatDate(new Date(this.fechaTrabajo), 'yyyy-MM-dd', 'en'));
    this.formFiltersDelivery.controls[
      this.formFiltersDeliveryConstants.endingDate
    ].setValue(formatDate(new Date(this.fechaTrabajo), 'yyyy-MM-dd', 'en'));
  }

  loadInitialConfigurations() {
    this.buildCuotasArray();
    this._ticketService.getDropdownOptions().subscribe(
      (response) => {
        this.cmbPointsOfSale = response.pointsOfSale;
        this.cmbPaymentsMethod = response.paymentMethods;
        this.cmbBrands = response.brands;
        this.paymentCardsCredit = response.paymentCardsCredit;
        this.paymentCardsDebit = response.paymentCardsDebit;
      },
      (errorResponse) => {
        this.spinner.hide();
        this.alert.error(
          'Hubo un cargando las configuraciones, refresque la pagina por favor'
        );
      }
    );
  }
  private _getPendingTickets(): void {
    this._ticketService.getPendingTickets().subscribe((response) => {
      console.log('pendingTickets', response);
      this.pendingTickets = response;
    });
  }

  private retrieveSelectedBrandFromCombo(
    formGroup: FormGroup
  ): paymentMethodCardModel {
    let brandControl =
      formGroup.controls[this.constants.delivery.formData.controls.brand];
    let paymentMethodControl =
      formGroup.controls[
        this.constants.delivery.formData.controls.paymentMethod
      ].value;
    if (brandControl.value) {
      if (paymentMethodControl === Constants.delivery.paymentMethods.credit) {
        return this.paymentCardsCredit.find(
          (x) => x.descripcion === brandControl.value
        );
      } else if (
        paymentMethodControl === Constants.delivery.paymentMethods.debit
      ) {
        return this.paymentCardsDebit.find(
          (x) => x.descripcion === brandControl.value
        );
      }
    } else {
      return new paymentMethodCardModel();
    }
  }

  async save(formGroup: FormGroup = this.dialogNCData): Promise<void> {    
    this.updateValidators(formGroup);
    this.spinner.show();
    let ticketToUpdate = this._ticketService.buildTicketFromFormGroup(
      formGroup
    );
    ticketToUpdate.brand = this.retrieveSelectedBrandFromCombo(formGroup);
    ticketToUpdate.gatewayType = "VTOL";
    try {
      await this._ticketService
        .updateTicket(ticketToUpdate, this.userAD.userAD)
        .toPromise();
      formGroup.markAsPristine();
      this.pendingTickets = await this._ticketService
        .getPendingTickets()
        .toPromise();
      this.spinner.hide();
      this.alert.success('Se ha guardado el comprobante de forma exitosa');
      
      if(formGroup.controls[Constants.delivery.formData.controls.containsCreditNote].value){
        //Eliminamos el objeto de la lista, ya que fue modificado con exito
        this.dataSource.data.splice(this.dataSource.filteredData.indexOf(formGroup), 1);
        this.dataSource._updateChangeSubscription();        
      }

    } catch (error) {
      this.spinner.hide();
      this.alert.error(`Error: ${error.error.message}`);
    }
  }

  showDialogCreditNote(formGroup: FormGroup){
    this.dialogNCData = formGroup;
    this.dialogNC.open(this.creditNoteDialog)
  }
}
