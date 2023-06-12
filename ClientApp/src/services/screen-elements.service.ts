import { Injectable } from '@angular/core';
// import { InternalUser } from 'src/app/internalUser/model/internalUser';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ScreenElementsService {
  // internalUserLoged: InternalUser;

  constructor(private sharedService: SharedService) {}

  // getElementScreen(key: string): boolean {

  //   if (this.internalUserLoged === undefined || this.internalUserLoged === null) {
  //     this.internalUserLoged = this.sharedService.getUser();
  //   }

  //   if (this.internalUserLoged.role.permissions.find(x => x.screenPath === this.sharedService.getCurrentUrl()
  //     && (x.screenElements.filter(y => y.code === key && y.enabled).length !== 0))) {
  //     return true;
  //   }
  //   return false;
  // }

  // clearInternalUser() {
  //   this.internalUserLoged = undefined;
  // }
}
