import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';

import { NgxSpinnerModule } from 'ngx-spinner';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatTooltip,
  MatTooltipModule,
} from '@angular/material';

import { SideNavComponent } from './side-nav/side-nav.component';
import { SideNavIconsComponent } from './side-nav-icons/side-nav-icons.component';
import { AlertService } from 'src/services/alert.service';
import { MatToolbarModule, MatIconModule } from '@angular/material';
import { SidebarModule } from 'ng-sidebar';
import { IndexComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SidebarModule.forRoot(),
    NgxSpinnerModule,
  ],
  declarations: [
    LayoutComponent,
    SideNavComponent,
    SideNavIconsComponent,
    IndexComponent,
  ],
  providers: [AlertService],
  exports: [LayoutComponent, SideNavComponent],
})
export class UiModule {}
