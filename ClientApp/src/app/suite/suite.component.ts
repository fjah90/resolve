import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/services/spinner.service';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { SuiteService } from '../shared/services/suite.service';
import { TokenRequest } from './models/token.request';
import { Subscription } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.css'],
})
export class SuiteComponent implements OnInit, OnDestroy {
  private Code: string;
  private State: string;
  private RedirectState: string;
  private Subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private broadcastService: BroadcastService,
    private msalService: MsalService,
    private suiteService: SuiteService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.CapturarParametrosDeURL();
    this.LimpiarParametrosDeURL();
    this.LoginMSAL();
    this.SubscribirseALoginSuccess();
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.Subscription) {
      this.Subscription.unsubscribe();
    }
  }

  private LimpiarParametrosDeURL() {
    this.router.navigate(['authorize']);
  }

  private CapturarParametrosDeURL() {
    this.Code = this.activatedRoute.snapshot.queryParams.code;
    this.State = this.activatedRoute.snapshot.queryParams.state;
    this.RedirectState = this.activatedRoute.snapshot.queryParams.redirect_state;
  }

  private LoginMSAL() {
    this.msalService.loginPopup();
  }

  private SubscribirseALoginSuccess() {
    this.Subscription = this.broadcastService.subscribe(
      'msal:loginSuccess',
      (result) => {
        const bodyRequest = new TokenRequest(
          this.Code,
          this.State,
          this.RedirectState
        );
        this.storage.set('jwt', result.token);
        this.suiteService.validateToken(bodyRequest).subscribe(
          (finalToken) => {
            this.storage.set('jwt', finalToken);
            this.spinner.hide();
            // redirect a home
          },
          (error) => {
            alert('No se pudo validar la identidad del usuario');
          }
        );
      }
    );
  }
}
