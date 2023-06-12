import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// NAVEGACION
import { LayoutComponent } from './ui/layout/layout.component';
import { LoginAdComponent } from './login-ad/login-ad.component';
import { LogoutComponent } from './logOut/logout/logout.component';
import { ApplicationResolutionService } from 'src/services/app-resolution.service';
import { AdminDatosDeliveryComponent } from './datos-delivery/admin-datos-delivery/admin-datos-delivery.component';
import { SuiteComponent } from './suite/suite.component';
import { FacturaElectronicaComponent } from './factura-electronica/factura-electronica.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'datos-delivery',
        component: AdminDatosDeliveryComponent,
        data: { nexturl: '/datos-delivery' },
      },
      {
        path: 'factura-electronica',
        component: FacturaElectronicaComponent,
        data: { nexturl: '/factura-electronica' },
      },
      // {path: 'authorize', component: SuiteComponent, data: {nexturl: '/authorize'}},
      // {path: 'authorize/:code/:state/:redirect_state', component: SuiteComponent, data: {nexturl: '/authorize'}}
    ],
  },
  { path: 'login', component: LoginAdComponent, data: { nexturl: '/login' } },
  { path: 'logout', component: LogoutComponent, data: { nexturl: '/logout' } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private resolution: ApplicationResolutionService) {
    this.resolution.getIsMobileResolution();
  }
}
