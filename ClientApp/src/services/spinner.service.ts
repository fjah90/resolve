import { Injectable, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(public spinner: NgxSpinnerService) {}

  public show() {
    setTimeout(() => this.spinner.show(), 0.000000001);
  }

  public hide() {
    this.spinner.hide();
  }
}
