import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalForwardComponent } from './modal-forward.component';

describe('ModalForwardComponent', () => {
  let component: ModalForwardComponent;
  let fixture: ComponentFixture<ModalForwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalForwardComponent],
      imports: [
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
