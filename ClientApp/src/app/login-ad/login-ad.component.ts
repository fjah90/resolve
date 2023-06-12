import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
// import { ParameterService } from 'src/services/Parameter.service';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { SharedService } from '../../services/shared.service';
import { version } from '../../../package.json';

const httpOptions = {
  headers: new HttpHeaders({
    'Contet-Type': 'application/json',
  }),
};

@Component({
  selector: 'app-login-ad',
  templateUrl: './login-ad.component.html',
  styleUrls: ['./login-ad.component.css'],
})
export class LoginAdComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  loginSuccesFired: boolean;
  errorMessage: string;
  token: string;
  ntoken: string;
  invalidLogin: boolean;
  response: any;
  loggedIn: boolean;
  public isIframe: boolean;
  version: string;

  constructor(
    private broadcastService: BroadcastService,
    private sharedService: SharedService /*private client: HttpClient, */,
    private router: Router,
    private spinner: NgxSpinnerService /* private parameterService: ParameterService, */,
    private authService: MsalService
  ) {}

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.version = version.replace('-', '.');

    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      this.loggedIn = false;
    });

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      if (!this.loginSuccesFired) {
        this.loggedIn = true;
        this.token = payload._token;
        this.sharedService.clearLocalStorage();
        this.sharedService.setToken(payload._token);
        this.getInternalToken();
        this.loginSuccesFired = true;
      }
    });
  }

  login() {
    const isIE =
      window.navigator.userAgent.indexOf('MSIE') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }

  getInternalToken() {
    this.spinner.show();
    this.saveTokenAndUser();
  }

  saveTokenAndUser() {
    this.sharedService.clearLocalStorage();
    this.sharedService.setToken(this.token);
    // this.sharedService.setUser(this.response.internalUser);
    this.invalidLogin = false;
    this.router.navigate(['importarPreparacionConsolidada']);
    this.spinner.hide();
  }
}
