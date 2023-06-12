import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import { InternalUser } from './internalUser/model/internalUser';

import { AlertService } from 'src/services/alert.service';
import { ModalService } from 'src/services/modal.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // internalUser: InternalUser;
  urlPath: string;
  se: string;
  continue: boolean;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private alertService: AlertService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private modalService: ModalService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.urlPath = route.routeConfig.data.nexturl;
    this.se = route.routeConfig.data.se;
    this.continue = false;
    // this.internalUser = this.storage.get('USER');
    const token = this.storage.get('jwt');

    if (token === undefined && this.urlPath !== '/login') {
      this.modalService.closeAll();
      localStorage.clear();
      this.router.navigate(['login']);
    }

    // if (this.urlPath !== 'Login') {
    //   this.validatePermission();
    // }

    this.saveCurrentUrl();

    if (token !== undefined) {
      return true;
    }
  }

  // validatePermission() {
  //   this.internalUser.role.permissions.forEach(
  //     element => {
  //       if (element.screenElements.filter(e => e.code === this.se && e.enabled).length !== 0) {
  //         this.continue = true;
  //       }
  //     });
  //   if (this.continue === false) {
  //     this.alertService.error('Tu usuario no tiene los permisos suficientes');
  //     this.router.navigate([this.router.url]);
  //   }
  // }

  saveCurrentUrl() {
    this.storage.set('currentUrl', this.urlPath);
  }
}
