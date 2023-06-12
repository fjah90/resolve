import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { Sucursal } from 'src/app/sucursal/models/Sucursal';
import { FacturaElectronicaForm } from 'src/model/facturaElectronicaForm';
import { AlertService } from 'src/services/alert.service';
import { TicketService } from '../../datos-delivery/ticket.service';
import * as moment from 'moment';



function fromToDateValidator(fromDateField: string, toDateField: string, errorName: string = 'toDateLessThanFromDate'): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDate = formGroup.get(fromDateField).value;
      const toDate = formGroup.get(toDateField).value;
     // Ausing the fromDate and toDate are numbers. In not convert them first after null check
      if ((fromDate !== null && toDate !== null) && fromDate > toDate) {
          return {[errorName]: true};
      }
      return null;
  };
}


//Refactorizar luego
export class DateValidator {

  static formatDateValidation(control: FormControl, errorName: string = 'invalidDateFormat'):  { [key: string]: any } {
    if(!moment(control.value, 'MM/DD/YYYY',true).isValid())
          return { [errorName]: true };

      return null;
  }
}

@Component({
  selector: 'app-factura-electronica-search',
  templateUrl: './factura-electronica-search.component.html',
  styleUrls: ['./factura-electronica-search.component.css'],
})
export class FacturaElectronicaSearchComponent implements OnInit {
  @Input() readonly branchOffices: Sucursal[];
  @Input() readonly currentBranchOffice$: Subject<number>;
  @Input() readonly sensitiveRequired$: Subject<boolean>;
  @Input() readonly dateWindow$: Subject<number>;
  //TODO: new arrays
  @Input() readonly cajas: Sucursal[];

  @Output()
  readonly submitForm: EventEmitter<FacturaElectronicaForm> = new EventEmitter();

  readonly minDate = new Date(2000, 0, 1);
  readonly maxDate = new Date();

  cmbPointsOfSale: number[] = [];

  searchForm: FormGroup = new FormGroup({
    sensitive: new FormControl(''),
    branchOfficeNumber: new FormControl(-1, [Validators.required,]),
    fromDate: new FormControl(
      new Date(
        this.maxDate.getFullYear(),
        this.maxDate.getMonth(),
        this.maxDate.getDate() - 30
      ),[DateValidator.formatDateValidation]  
    ),
    toDate: new FormControl(this.maxDate,[DateValidator.formatDateValidation]),
    pointOfSale: new FormControl(-1, [Validators.required,]),
    fromAmount: new FormControl(''),
    toAmount: new FormControl(''),
    detailCUF: new FormControl(''),
    hasError: new FormControl(true, [Validators.required,]),
    
    
  },{validators:[fromToDateValidator('fromDate','toDate')]});

  constructor(
    private readonly datePipe: DatePipe,
    private readonly alertSvc: AlertService,
    private _ticketService: TicketService,
  ) {}

  ngOnInit() {
    this.loadInitialConfigurations();
    forkJoin([
      this.sensitiveRequired$,
      this.currentBranchOffice$,
      this.dateWindow$,
    ]).subscribe((res: [boolean, number, number]) => {
      this.setSensitiveValidator(res[0]);
      this.setCurrentBranchOffice(res[1]);
      this.setInitialFromDate(res[2]);
    });
  }

  loadInitialConfigurations() {
    this._ticketService.getDropdownOptions().subscribe(
      (response) => {
        console.log(response);
        this.cmbPointsOfSale = response.pointsOfSale;
      },
      (errorResponse) => {
        console.log('Hubo un cargando las configuraciones, refresque la pagina por favor');
      }
    );
  }

  public onSubmit() {
    if (this.searchForm.valid) {      
      const form: FacturaElectronicaForm = {
        sensitive: this.searchForm.value.sensitive,
        branchOfficeNumber: this.searchForm.value.branchOfficeNumber,
        fromDate: this.datePipe.transform(
          this.searchForm.value.fromDate,
          'yyyy-MM-dd'
        ),
        //fromDate: this.searchForm.value.fromDate,
        toDate: this.datePipe.transform(
          this.searchForm.value.toDate,
          'yyyy-MM-dd'
        ),
        pointOfSale: this.searchForm.value.pointOfSale,
        fromAmount: this.searchForm.value.fromAmount,
        toAmount: this.searchForm.value.toAmount,
        detailCUF: this.searchForm.value.detailCUF,
        hasError: this.searchForm.value.hasError,
      };

      this.submitForm.emit(form);
    } else {
      this.getError(this.searchForm)
      
    }
  }

  

  getError(searchForm: FormGroup) {
   
    if(this.searchForm.value.fromDate > new Date() || this.searchForm.value.toDate > new Date()){
      this.alertSvc.info('Las fechas ingresadas son incorrectas');
    }
    else if(this.searchForm.errors.toDateLessThanFromDate){
      this.alertSvc.info('La fecha "Desde" no puede ser mayor a la fecha "Hasta"');
    }
    else if(this.searchForm.errors.invalidDateFormat){
      this.alertSvc.info('Formato de fecha invalido');
    }
    else{
      this.alertSvc.info('Por favor complete los campos requeridos');
    }
  }


  // Setea el valor inicial del campo Sucursal, el cual es la sucursal que está logueado el usuario
  private setCurrentBranchOffice(n: number): void {
    this.searchForm.patchValue({
      branchOfficeNumber: n,
    });
  }

  // Setea la fecha inicial del campo "desde", la cual es (dia actual - (cantidad de dias especificados en la config))
  private setInitialFromDate(n: number) {
    this.searchForm
      .get('fromDate')
      .patchValue(
        new Date(
          this.maxDate.getFullYear(),
          this.maxDate.getMonth(),
          this.maxDate.getDate() - n
        )
      );
  }

  // Setea el validator del campo sensitive en caso de que esté habilitado en la configuración
  private setSensitiveValidator(required: boolean) {
    if (required) {
      this.searchForm.get('sensitive').setValidators(Validators.required);
      this.searchForm.get('sensitive').updateValueAndValidity();
    }
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
}
