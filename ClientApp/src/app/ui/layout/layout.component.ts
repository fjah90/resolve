import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/services/shared.service';
import { ModalService } from 'src/services/modal.service';
import * as jwt_decode from 'jwt-decode';
import { User } from 'src/model/user';
import { AlertService } from 'src/services/alert.service';
import { ConfiguracionSucursalUsuarioComponent } from './configuracion-sucursal-usuario/configuracion-sucursal-usuario.component';
import { SucursalService } from 'src/app/shared/services/sucursal.service';
import { SettingsService } from 'src/services/settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from 'src/app/sucursal/models/Sucursal';
import { ObservatorSucursal } from 'src/app/shared/observators/sucursal-observator';
import { SpinnerService } from 'src/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  spinnerMessage: string = 'Cargando...';
  _opened = true;

  nombreUsuario: string;
  CodUsuario: number;
  SucursalId: number;
  EditarSucursal: boolean = this._settingService.editarSucursal === 'true';
  public formSucursal: FormGroup;
  public changeSucursalValue = false;
  public labelSucursal: string;
  public nombreSucursal: string;
  private cantidadIntentosFallidos = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private router: Router,
    public modalService: ModalService,
    private alert: AlertService,
    public userAD: User,
    private sucursalService: SucursalService,
    private _settingService: SettingsService,
    private spinner: SpinnerService,
    private observatorSucursal: ObservatorSucursal
  ) {
    this.userAD.CodUsuario = 0;
    this.userAD.SucursalId = 0;
    this.userAD.SucursalIdSel = 0;
  }

  ngOnInit() {
    if (!localStorage.getItem('msal.idtoken')) {
      this.router.navigate(['login']);
      return;
    }
    this.spinner.show();
    // this.sucursal.loadSucursalGlobal();
    this.getUsrLogin();
    this.createFormSucursal();
    this.getSucursal();
    this.subscribeObserverChangesSucursal();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeObserverChangesSucursal() {
    ///si editaron el input de sucursal sin guardar al entrar a cualquier opcion del side-nav se recupera el valor
    ///de la sucursal elegida anteriormente ya que no se guardaron los cambios.
    this.subscription.add(
      this.observatorSucursal
        .getEmisionSucursalObservable()
        .subscribe((sucursal) => {
          this.sucursalControlSetValue(`${sucursal.numero.toString()}`);
          this.setChangeSucursal(false);
        })
    );
  }

  private createFormSucursal(): void {
    this.formSucursal = new FormGroup({
      sucursal: new FormControl({
        value: '',
        disabled: this._settingService.editarSucursal === 'false',
      }),
    });
  }

  private manageResponseSucursal(
    datosSucursal: Sucursal,
    fromStorage: boolean = false
  ): void {
    if (datosSucursal) {
      this.sucursalService.setSucursalInStorage(datosSucursal);
      if (this._settingService.editarSucursal === 'true') {
        this.setEditarSucursal(true);
        this.sucursalControlEnable();
      } else {
        this.setEditarSucursal(false);
        this.sucursalControlDisable();
      }
      const sucursal = datosSucursal.numero.toString();
      this.setValueNombreSucursal(
        `${datosSucursal.numero}-${datosSucursal.nombre}`
      );
      this.sucursalControlSetValue(`${sucursal}`);
      this._settingService.setBranchOffice(sucursal);
      if (!fromStorage) {
        this.alert.success('Se configuró correctamente el número de sucursal');
      }
    } else {
      this.setControlesParasolicitarSucursalAlUsuario();
      this.alert.error(
        'No se encontro ninguna sucursal. Ingrese una sucursal para configurarla en el sistema'
      );
    }
    this.cantidadIntentosFallidos = 0;
    this.setChangeSucursal(false);
  }

  private setControlesParasolicitarSucursalAlUsuario() {
    this.setEditarSucursal(true);
    this.sucursalControlSetValue('');
    this.sucursalControlEnable();
    this.sucursalService.removeSucursalFromStorage();
    this._settingService.setBranchOffice('');
    this.setValueNombreSucursal('');
  }

  private setValueNombreSucursal(value: string) {
    this.nombreSucursal = value;
  }

  private sucursalControlSetValue(value: string): void {
    this.formSucursal.controls.sucursal.setValue(value);
  }

  private sucursalControlEnable() {
    this.formSucursal.controls.sucursal.enable();
  }

  private sucursalControlDisable() {
    this.formSucursal.controls.sucursal.disable();
  }

  private setEditarSucursal(value: boolean): void {
    this.EditarSucursal = value;
  }

  public changeSucursal() {
    this.changeSucursalValue = true;
  }

  private setChangeSucursal(value: boolean) {
    this.changeSucursalValue = value;
  }

  public setSucursal() {
    this.spinner.show();
    const Sucursal: string = this.formSucursal.controls.sucursal.value;
    if (!Sucursal) {
      this.alert.info('Debe ingresar un número de sucursal');
      this.spinner.hide();
      return;
    } else {
      this.sucursalService.getSucursalByNumber(Sucursal).subscribe(
        (datosSucursal) => {
          this.manageResponseSucursal(datosSucursal);
          this.navigateToHome();
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.manageErrorResponseSucursal();
          this.alert.error('Sucursal inaccesible');
        }
      );
    }
  }

  private getSucursal() {
    this.spinner.show();
    if (!this.sucursalService.getSucursalFromStorage()) {
      setTimeout(() => {
        this.sucursalService.getSucursal().subscribe(
          (datosSucursal) => {
            this.manageResponseSucursal(datosSucursal);
            this.spinner.hide();
          },
          (error) => {
            console.log(error);
            if (this.cantidadIntentosFallidos < 2) {
              this.getSucursal();
              this.cantidadIntentosFallidos++;
            } else {
              this.manageErrorResponseSucursal();
              this.alert.error(
                'Hubo un error al intentar determinar la sucursal del cliente, por favor ingrese el número de sucursal en el que se encuentra para configurarla en el sistema'
              );
            }
          }
        );
      });
      
    } else {
      const sucursal: Sucursal = this.sucursalService.getSucursalFromStorage();
      this.manageResponseSucursal(sucursal, true);
      this.spinner.hide();
    }
  }

  private manageErrorResponseSucursal() {
    this.setControlesParasolicitarSucursalAlUsuario();
    this.navigateToHome();
    this.spinner.hide();
  }

  private navigateToHome() {
    this.router.navigate(['']);
  }

  getUsrLogin() {
    if (!localStorage.getItem('msal.idtoken')) {
      this.router.navigate(['login']);
      return '';
    }

    const decodeToken = jwt_decode(localStorage.getItem('msal.idtoken'));
    this.nombreUsuario = decodeToken.name;

    this.setCodUsuario();
  }

  setCodUsuario() {
    const decode = jwt_decode(localStorage.getItem('msal.idtoken'));
    this.getCodUsuario(
      decode.preferred_username,
      decode.preferred_username.indexOf('@', 0)
    );
  }

  getCodUsuario(userAd: string, pos: number) {
    userAd = userAd.substr(0, pos);
    this.userAD.userAD = userAd;

    // this.service.getAll('DBSeguridad..UsuarioAD',
    //                     undefined,
    //                     undefined,
    //                     btoa('[{"campo":"usrAD","comparacion":"=","valor":\'' + userAd + '\'}]'))
    //             .subscribe(response => { this.CodUsuario = response[0].codUsuarioAD === 0 ? response[0].codUsuario : response[0].codUsuarioAD;
    //                                      this.userAD.CodUsuario = this.CodUsuario;
    //                                      this.setSucursal();
    //                                    }, error => { this.alert.error(this.msgAlert.setMessage(error.status));
    //                                                  this.userAD.CodUsuario = undefined;
    //                                                 });
  }

  saveSucursal() {
    // this.service.getAll('DBSeguridad..Usuario',
    //                     undefined,
    //                     undefined,
    //                     btoa('[{"campo":"codUsuario","comparacion":"=","valor":' + this.CodUsuario + '}]'))
    //              .subscribe(response => { this.SucursalId = response[0].codUbicacion < 0 ? 0 : response[0].codUbicacion;
    //                                       this.userAD.SucursalId = response[0].codUbicacion < 0 ? 0 : response[0].codUbicacion;
    //                                       this.userAD.SucursalIdSel = this.userAD.SucursalId;
    //                                     }, error => { this.userAD.SucursalId = 0; this.userAD.SucursalIdSel = 0;
    //                                                   this.alert.error(this.msgAlert.setMessage(error.status));
    //                                                   if (this.userAD.CodUsuario === 0) { this.alert.error(this.msgAlert.setMessage(1)); }
    //                                                 });
  }

  onActivate(componentReference) {
    this.spinnerMessage = componentReference.hasOwnProperty('spinnerMessage')
      ? componentReference.spinnerMessage
      : 'Cargando...';
  }

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  logOut() {
    localStorage.clear();
    this.sharedService.clearLocalStorage();
    // this.screenElementsService.clearInternalUser();
    this.router.navigate(['login']);
  }

  // openConfigNotification() {
  //   let dialogRef;
  //   dialogRef = this.modalService.open(NotificationConfigurationComponent, {
  //     width: '950px',
  //     autoFocus: false
  //   });
  // }

  openCambioSucursal() {
    let dialogRef;

    dialogRef = this.modalService.open(ConfiguracionSucursalUsuarioComponent, {
      width: '800px',
    });

    dialogRef.componentInstance.onUpdateSucursal.subscribe(() => {
      this.CodUsuario = this.userAD.CodUsuario;
      this.modalService.closeAll();
    });
  }
}
