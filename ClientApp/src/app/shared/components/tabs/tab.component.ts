import { Component, Input } from '@angular/core';

@Component({
  selector: 'fmc-tab',
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() active = false;
}
