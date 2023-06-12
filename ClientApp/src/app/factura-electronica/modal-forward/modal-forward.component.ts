import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-forward',
  templateUrl: './modal-forward.component.html',
  styleUrls: ['./modal-forward.component.css'],
})
export class ModalForwardComponent implements OnInit {
  public email: FormControl = new FormControl(this.user.email, [
    Validators.email,
    Validators.required,
  ]);

  constructor(@Inject(MAT_DIALOG_DATA) private user: any) {}

  public forward() {
    return this.email.value;
  }

  ngOnInit() {}
}
