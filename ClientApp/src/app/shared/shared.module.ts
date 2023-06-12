import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponent } from './components/tabs/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';

import { AccordionComponent } from './components/accordions/accordion.component';
import { AccordionGroupComponent } from './components/accordions/accordion-group.component';
import { ApplicationResolutionService } from '../../services/app-resolution.service';
import { ObservatorSucursal } from './observators/sucursal-observator';
import { InputNumberDirective } from './directives/input.number.directive';
import { KeyTabDirective } from './directives/key.tab.directive';
import { KeyEnterCheckboxDirective } from './directives/key.enter.checkbox.directive';
import { SpecialCharacterDirective } from './directives/specialChracter.directive';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorIntlEsp } from './intl/MatPaginatorIntlEsp';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TabComponent,
    TabsComponent,
    AccordionComponent,
    AccordionGroupComponent,
    InputNumberDirective,
    KeyTabDirective,
    KeyEnterCheckboxDirective,
    SpecialCharacterDirective,
  ],
  providers: [
    ApplicationResolutionService,
    ObservatorSucursal,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp },
  ],
  exports: [
    TabComponent,
    TabsComponent,
    AccordionComponent,
    AccordionGroupComponent,
    InputNumberDirective,
    KeyTabDirective,
    KeyEnterCheckboxDirective,
    SpecialCharacterDirective,
  ],
})
export class SharedModule {}
