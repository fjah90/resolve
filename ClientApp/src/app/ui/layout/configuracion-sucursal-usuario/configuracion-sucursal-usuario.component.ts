import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sucursales } from '../../../../model/Sucursales';
import { ServiceGen } from 'src/services/serviceGen.service';
import { User } from 'src/model/user';
import { AlertService } from 'src/services/alert.service';
import { Filtros } from 'src/model/Filtros';
import { SucursalesTodas } from 'src/services/sucursales.service';

@Component({
  selector: 'app-configuracion-sucursal-usuario',
  templateUrl: './configuracion-sucursal-usuario.component.html',
  styleUrls: ['./configuracion-sucursal-usuario.component.css'],
})
export class ConfiguracionSucursalUsuarioComponent implements OnInit {
  spinnerMessage: 'Configurando sucursal...';
  public onUpdateSucursal = new EventEmitter();

  cambioSucursal = false;

  Sucursales: Sucursales[] = [];
  sucursalesFilter: Sucursales[] = [];

  updateSucursalUsr: FormGroup;
  events: string[] = [];

  constructor(
    private service: ServiceGen,
    private fb: FormBuilder,
    private alert: AlertService,
    public userAD: User,
    private filtros: Filtros,
    public sucursalesTodas: SucursalesTodas
  ) {
    this.loadSucursales();
    this.setForm();
  }

  setForm() {
    let codUsuarioDisabled: boolean;

    codUsuarioDisabled =
      this.userAD.CodUsuario !== undefined && this.userAD.CodUsuario > 0;

    this.updateSucursalUsr = this.fb.group({
      Usuario: [{ value: this.userAD.userAD, disabled: true }],
      codUsuario: [
        { value: this.userAD.CodUsuario, disabled: codUsuarioDisabled },
      ],
      sucursales: [{ value: this.userAD.SucursalId }],
    });
  }

  ngOnInit() {}

  setCambioSucursal() {
    this.cambioSucursal = this.updateSucursalUsr.controls.sucursales.value > 0;
  }

  // CARGA DE SUCURSALES
  loadSucursales() {
    if (!localStorage.getItem('lstSucursales')) {
      this.sucursalesTodas.loadSucursalGlobal();
    }
    if (this.sucursalesTodas.arrSucursales.length === 0) {
      this.Sucursales = JSON.parse(localStorage.getItem('lstSucursales'));
      this.sucursalesFilter = this.Sucursales;
      return;
    }
    this.Sucursales = this.sucursalesTodas.arrSucursales;
    this.sucursalesFilter = this.sucursalesTodas.arrSucursales;
  }

  updateSucursal() {
    this.userAD.SucursalId = this.updateSucursalUsr.controls.sucursales.value;
    this.userAD.SucursalIdSel = this.userAD.SucursalId;
    this.userAD.CodUsuario = this.updateSucursalUsr.controls.codUsuario.value;
    this.alert.success(
      'Se han modificado los datos del usuario temporalmente.'
    );
    this.onUpdateSucursal.emit();
  }

  filterSucursales(filtro: string) {
    this.Sucursales = this.sucursalesFilter.filter((element) =>
      element.nomSucursal.includes(filtro)
    );
  }
}
