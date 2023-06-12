import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ModalConfig } from './model/ModalConfig';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css'],
})
export class ModalConfirmComponent implements OnInit {
  public onConfirm = new EventEmitter();
  btnLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) public modalConfig: ModalConfig) {}

  ngOnInit() {}

  confirmClicked() {
    this.onConfirm.emit();
  }
}
