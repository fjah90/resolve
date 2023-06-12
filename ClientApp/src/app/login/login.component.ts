import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  token: string;
  invalidLogin: boolean;
  response: any;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.sharedService.currentToken.subscribe((token) => (this.token = token));
  }

  login(form: NgForm) {
    this.spinner.show();
    this.saveTokenAndUser();
  }

  saveTokenAndUser() {
    this.sharedService.clearLocalStorage();
    this.sharedService.setToken(this.token);
    // this.sharedService.setUser(this.response.internalUser);
    this.invalidLogin = false;
    // this.router.navigate(['datos-delivery']);
    this.spinner.hide();
  }
}
