import { Injectable, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ComponentType } from '@angular/cdk/overlay/index';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) {}

  public open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    const element = document.querySelectorAll('.sidebar-menu')[0];
    element.setAttribute('style', ' z-index: 1 !important;');
    const modal = this.dialog.open(componentOrTemplateRef, config);
    modal.disableClose = true;
    return modal;
  }

  public closeAll(): void {
    this.dialog.openDialogs.forEach((d) => d.close());
  }
}
