import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// NAVEGACION
import { NotFoundComponent } from './not-found/not-found.component';

// FIN DE NAVEGACION

import { TokenInterceptor } from '../interceptors/token.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatDividerModule,
  MatSelectModule,
  MatTabsModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatNativeDateModule,
  MatSortModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatDatepickerModule,
  MatTableModule,
  MatProgressBarModule,
  MatStepperModule,
  MatTooltipModule,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SidebarModule } from 'ng-sidebar';
import { MsalConfig, MsalModule } from '@azure/msal-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { UiModule } from './ui/ui.module';
import { ModalConfirmComponent } from './common/modal-confirm/modal-confirm.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LoginAdComponent } from './login-ad/login-ad.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logOut/logout/logout.component';
import { ConfiguracionSucursalUsuarioComponent } from './ui/layout/configuracion-sucursal-usuario/configuracion-sucursal-usuario.component';
import { AdminDatosDeliveryComponent } from './datos-delivery/admin-datos-delivery/admin-datos-delivery.component';
import { DetailsModalComponent } from './datos-delivery/components/details-modal/details-modal.component';
import { SuiteComponent } from './suite/suite.component';
import { appInit, SettingsService } from 'src/services/settings.service';
import { SharedModule } from './shared/shared.module';
import {
  FacturaElectronicaComponent,
  FacturaElectronicaTblComponent,
  FacturaElectronicaDetailComponent,
  ModalForwardComponent,
} from '../app/factura-electronica/index';

import {
  MsalService,
  MSAL_CONFIG,
} from '@azure/msal-angular/dist/msal.service';
import { FacturaElectronicaSearchComponent } from './factura-electronica/factura-electronica-search/factura-electronica-search.component';
import { PesosPipe } from './shared/pipes/pesos.pipe';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

export function loggerCallBack(logLevel, message, piiEntable) {
  console.log('Cliente logging' + message);
}

export const protectedResourceMap: [string, string[]][] = [
  [
    'https://buildtodoservice.azurewebsites.net/api/todolist',
    ['api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user'],
  ],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
];

const isIE =
  window.navigator.userAgent.indexOf('MSIE') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function getMsalConfig() {
  const urlFront = `${window.location.origin}/`;
  const config = new MsalConfig();
  config.clientID = '4e236827-d6b3-43b1-9b3d-8992af433a7d';
  config.authority = 'https://login.microsoftonline.com/farmacity.com.ar';
  config.validateAuthority = true;
  config.redirectUri = urlFront;
  config.cacheLocation = 'localStorage';
  config.postLogoutRedirectUri = urlFront;
  config.navigateToLoginRequestUrl = true;
  config.consentScopes = [
    'user.read',
    'openid',
    'profile',
    'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user',
  ];
  config.unprotectedResources = ['https://www.microsoft.com/en-us/'];
  config.correlationId = '1234';
  config.piiLoggingEnabled = true;
  config.storeAuthStateInCookie = isIE;
  config.popUp = !isIE;
  config.protectedResourceMap = protectedResourceMap;
  config.logger = loggerCallBack;
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginAdComponent,
    LoginComponent,
    LogoutComponent,
    NotFoundComponent,
    ModalConfirmComponent,
    ConfiguracionSucursalUsuarioComponent,
    AdminDatosDeliveryComponent,
    DetailsModalComponent,
    SuiteComponent,
    FacturaElectronicaComponent,
    FacturaElectronicaSearchComponent,
    FacturaElectronicaTblComponent,
    FacturaElectronicaDetailComponent,
    ModalForwardComponent,
    PesosPipe,
  ],
  imports: [
    NgxMatSelectSearchModule,
    NgxPrintModule,
    NgxBarcodeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatSortModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTooltipModule,
    MatGridListModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxSpinnerModule,
    SidebarModule.forRoot(),
    // inicio de login con AD
    MsalModule,
    // fin de login con AD
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    SharedModule,
  ],
  providers: [
    AuthGuard,
    DatePipe,
    CurrencyPipe,
    MatDatepickerModule,
    MsalService,
    {
      provide: MSAL_CONFIG,
      useValue: getMsalConfig(),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      deps: [SettingsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalConfirmComponent,
    ConfiguracionSucursalUsuarioComponent,
    DetailsModalComponent,
    ModalForwardComponent,
  ],
})
export class AppModule {}
