import { Injectable } from '@angular/core';
import * as resources from 'src/assets/resources/app.json';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  public resources: any;

  constructor() {
    this.resources = (resources as any).default;
  }
}
