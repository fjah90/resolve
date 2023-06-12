import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class OmnicanalService {
  version = 'v1/';
  urlApiWithOfficeId: string;
  constructor(private _http: HttpClient, private _settings: SettingsService) {}

  setUrl() {
    console.log('setUrl omnicanalservice');
    console.log('this._settings.apiOmnicanal', this._settings.apiOmnicanal);
    this.urlApiWithOfficeId = this._settings.getUrlWithOfficeId();
    console.log('this.urlApiWithOfficeId', this.urlApiWithOfficeId);
  }

  getVersion(): Observable<string> {
    this.setUrl();
    const endpoint = 'webapi/getVersion';
    console.log(this.urlApiWithOfficeId);
    console.log(this.version);
    console.log(endpoint);
    const url = `${this.urlApiWithOfficeId}${this.version}${endpoint}`;
    console.log('url', url);

    return this._http.get<string>(url);
  }
}
