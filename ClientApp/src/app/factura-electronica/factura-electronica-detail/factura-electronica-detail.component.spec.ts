import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_INITIALIZER } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatGridListModule,
  MatListModule,
  MatSnackBarModule,
  MatTableModule,
} from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PesosPipe } from 'src/app/shared/pipes/pesos.pipe';
import { FacturaElectronica } from 'src/model/facturaElectronica';
import { AlertService } from 'src/services/alert.service';
import { appInit, SettingsService } from 'src/services/settings.service';
import { FacturaElectronicaComponent } from '../factura-electronica.component';

import { FacturaElectronicaDetailComponent } from './factura-electronica-detail.component';

describe('FacturaElectronicaDetailComponent', () => {
  let component: FacturaElectronicaDetailComponent;
  let fixture: ComponentFixture<FacturaElectronicaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturaElectronicaDetailComponent, PesosPipe],
      imports: [
        CommonModule,
        HttpClientTestingModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatGridListModule,
        MatTableModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        AlertService,
        {
          provide: APP_INITIALIZER,
          useFactory: appInit,
          deps: [SettingsService],
          multi: true,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaElectronicaDetailComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.factura = new FacturaElectronica(
      1,
      12345678,
      100,
      100,
      0,
      123,
      new Date(),
      8,
      1,
      'christian.cavanna@farmacity.com.ar',
      'CHRISTIAN CAVANNA',
      '20210119',
      8,
      false,
      '',
      1,
      []
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
