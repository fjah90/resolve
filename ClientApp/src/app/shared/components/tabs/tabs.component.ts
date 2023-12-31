import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'fmc-tabs',
  template: `
    <div class="nav nav-tabs flex ">
      <div
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        class="tab"
        [class.active]="tab.active"
      >
        <a href="javascript:void(0);">{{ tab.tabTitle }}</a>
      </div>
    </div>
    <ng-content></ng-content>
  `,
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab: TabComponent) => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
