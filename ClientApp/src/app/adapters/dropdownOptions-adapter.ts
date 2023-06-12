import { DropdownOptions } from '../datos-delivery/Models/dropdownOptions.model';
import { DropdownOptionsDto } from '../datos-delivery/dto/dropdownOptionsDto';
import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DropdownOptionsAdapter implements Adapter<DropdownOptions> {
  adapt(dropdownOptions: DropdownOptionsDto): DropdownOptions {
    return new DropdownOptions(
      dropdownOptions.cajas,
      dropdownOptions.formasDePago,
      dropdownOptions.tarjetasCredito,
      dropdownOptions.tarjetasDebito,
      dropdownOptions.marcas
    );
  }
}
