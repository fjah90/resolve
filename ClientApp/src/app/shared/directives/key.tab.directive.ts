import { Directive, HostListener, Input } from '@angular/core';
import { MatButton, MatCheckbox, MatInput, MatSelect } from '@angular/material';

@Directive({
  selector: '[keyTab]',
})
export class KeyTabDirective {
  @Input('tableName') tableName: string;

  @HostListener('keydown.tab', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let focusedElementId = (event.currentTarget as HTMLElement).id;
    if (!focusedElementId) {
      return;
    }

    let ticketsTableBody = document
      .getElementById(this.tableName)
      .children.item(1);
    let cellFocused = false;

    for (
      let indexRow = 0;
      indexRow < ticketsTableBody.children.length;
      indexRow++
    ) {
      let row = ticketsTableBody.children[indexRow];
      for (let indexCell = 0; indexCell < row.children.length; indexCell++) {
        let cell = row.children.item(indexCell);
        let htmlElement = this.getMaterialControlFromCell(cell);
        if (htmlElement.id === focusedElementId) {
          this.focusNextCell(row, indexCell);
          cellFocused = true;
          break;
        }
      }
      if (cellFocused) {
        break;
      }
    }
  }

  private focusNextCell(
    row: Element,
    indexCell: number,
    incrementIndex: number = 0
  ): void {
    let nextCell = null;
    let nextCellIndex = null;

    if (row.children.length >= indexCell + 1 + incrementIndex) {
      nextCellIndex = indexCell + 1 + incrementIndex;
      nextCell = row.children.item(nextCellIndex);
    }

    if (!nextCell) {
      nextCell = row.children.item(0);
    }

    let materialControl = this.getMaterialControlFromCell(nextCell);
    if (
      materialControl.hasAttribute('disabled') ||
      materialControl.className.includes('disabled')
    ) {
      incrementIndex++;
      this.focusNextCell(row, indexCell, incrementIndex);
    } else {
      incrementIndex = 0;
      materialControl.focus();
      event.preventDefault();
    }
  }

  private isMaterialControl(htmlElement: Element): boolean {
    return (
      htmlElement.classList.contains('mat-input-element') ||
      htmlElement.classList.contains('mat-select') ||
      htmlElement.classList.contains('mat-checkbox') ||
      htmlElement.classList.contains('mat-icon-button')
    );
  }

  private getMaterialControlFromCell(cell: Element): HTMLElement {
    let element: any = cell;

    while (!this.isMaterialControl(element)) {
      element = element.firstElementChild;
    }

    return element;
  }
}
