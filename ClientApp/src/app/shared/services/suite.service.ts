import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenRequest } from 'src/app/suite/models/token.request';
import { SettingsService } from 'src/services/settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuiteService {
  private Url: string;

  constructor(private http: HttpClient, settingsSvc: SettingsService) {
    this.Url = `${settingsSvc.config.endpoints['omni'].uri}api/external`;
  }

  public validateToken(body: TokenRequest): Observable<string> {
    const headersParameters = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<string>(`${this.Url}/token`, JSON.stringify(body), {
      headers: headersParameters,
    });
  }
}
