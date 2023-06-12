import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_INITIALIZER } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { PesosPipe } from 'src/app/shared/pipes/pesos.pipe';
import { AlertService } from 'src/services/alert.service';
import { appInit, SettingsService } from 'src/services/settings.service';

import { FacturaElectronicaTblComponent } from './factura-electronica-tbl.component';

describe('FacturaElectronicaTblComponent', () => {
  let component: FacturaElectronicaTblComponent;
  let fixture: ComponentFixture<FacturaElectronicaTblComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturaElectronicaTblComponent, PesosPipe],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatPaginatorModule,
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
    fixture = TestBed.createComponent(FacturaElectronicaTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
