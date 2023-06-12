import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[keyEnterCheckbox]',
})
export class KeyEnterCheckboxDirective {
  @HostListener('keydown.enter', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let checkbox = (event.currentTarget as HTMLInputElement).firstElementChild
      .firstElementChild.firstElementChild as HTMLInputElement;
    checkbox.click();
    event.preventDefault();
  }
}
