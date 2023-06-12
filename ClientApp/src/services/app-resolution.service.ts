import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationResolutionService {
  isMobileResolution: boolean;

  constructor() {
    this.isMobileResolution = window.innerWidth < 768;
    // if (window.innerWidth < 768) {
    //   this.isMobileResolution = true;
    // } else {
    //   this.isMobileResolution = false;
    // }
  }

  public getIsMobileResolution(): boolean {
    console.log(this.isMobileResolution);
    return this.isMobileResolution;
  }
}
