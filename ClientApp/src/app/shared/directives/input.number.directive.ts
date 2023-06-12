import { Directive, HostListener } from '@angular/core';
import { KeyCodes } from '../enums/keycodes';

@Directive({
  selector: '[inputNumber]',
})
export class InputNumberDirective {
  private regexNumeros: RegExp = new RegExp('^[0-9]+');

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    let pastedContent = event.clipboardData.getData('text');
    const startPosition = (event.currentTarget as HTMLTextAreaElement)
      .selectionStart;
    const currentValue = (event.currentTarget as HTMLTextAreaElement).value;
    let newValue = this.getNewValueString(
      currentValue,
      startPosition,
      pastedContent
    );

    if (!this.isNumber(newValue)) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      !this.isNumber(event.key) &&
      !this.isDeleteKey(event.keyCode) &&
      !this.isNavigationKey(event.keyCode) &&
      !this.isPasteCopyCutAction(event.keyCode, event.ctrlKey)
    ) {
      event.preventDefault();
      return;
    }
  }

  private getNewValueString(
    currentValue: string,
    position: number,
    valueToInsert: string
  ): string {
    return [
      currentValue.slice(0, position),
      valueToInsert,
      currentValue.slice(position),
    ].join('');
  }

  private isNumber(value: string): boolean {
    if (this.regexNumeros.test(value)) {
      return true;
    }

    return false;
  }

  private isDeleteKey(keyCode: number): boolean {
    return KeyCodes.BACKSPACE == keyCode || KeyCodes.DELETE == keyCode;
  }

  private isPasteCopyCutAction(keyCode: number, ctrlKey: boolean) {
    if (
      ctrlKey &&
      (keyCode == KeyCodes.KEY_V ||
        keyCode == KeyCodes.KEY_C ||
        keyCode == KeyCodes.KEY_X)
    ) {
      return true;
    }

    return false;
  }

  private isNavigationKey(keyCode: number): boolean {
    switch (keyCode) {
      case KeyCodes.LEFT_ARROW:
      case KeyCodes.RIGHT_ARROW:
      case KeyCodes.ENTER:
        return true;
      default:
        return false;
    }
  }
}
