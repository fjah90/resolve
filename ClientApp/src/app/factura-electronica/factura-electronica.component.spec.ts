import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FacturaElectronicaDetailComponent } from './factura-electronica-detail/factura-electronica-detail.component';
import { FacturaElectronicaSearchComponent } from './factura-electronica-search/factura-electronica-search.component';
import { FacturaElectronicaTblComponent } from './factura-electronica-tbl/factura-electronica-tbl.component';

import { FacturaElectronicaComponent } from './factura-electronica.component';
import { FacturaElectronicaService } from './factura-electronica.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDividerModule,
  MatGridListModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { PesosPipe } from '../shared/pipes/pesos.pipe';
import { appInit, SettingsService } from 'src/services/settings.service';
import { APP_INITIALIZER } from '@angular/core';
import { AlertService } from 'src/services/alert.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FacturaElectronicaComponent', () => {
  let component: FacturaElectronicaComponent;
  let fixture: ComponentFixture<FacturaElectronicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FacturaElectronicaComponent,
        FacturaElectronicaSearchComponent,
        FacturaElectronicaDetailComponent,
        FacturaElectronicaTblComponent,
        PesosPipe,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatSlideToggleModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatDividerModule,
        MatListModule,
        MatGridListModule,
        MatTableModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatNativeDateModule,
      ],
      providers: [
        DatePipe,
        AlertService,
        FacturaElectronicaService,
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
    fixture = TestBed.createComponent(FacturaElectronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
