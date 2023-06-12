import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatNativeDateModule,
  MatSnackBarModule,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from 'src/services/alert.service';
import { FacturaElectronicaService } from '../factura-electronica.service';

import { FacturaElectronicaSearchComponent } from './factura-electronica-search.component';

describe('FacturaElectronicaSearchComponent', () => {
  let component: FacturaElectronicaSearchComponent;
  let fixture: ComponentFixture<FacturaElectronicaSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturaElectronicaSearchComponent],
      imports: [
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatSnackBarModule,
        MatNativeDateModule,
      ],
      providers: [
        DatePipe,
        AlertService,
        FacturaElectronicaService,
        {
          provide: MAT_DATE_LOCALE,
          useValue: 'en-GB',
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaElectronicaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
