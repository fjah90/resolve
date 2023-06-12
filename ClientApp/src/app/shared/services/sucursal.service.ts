import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';
import { Sucursal } from 'src/app/sucursal/models/Sucursal';
import { SettingsService } from 'src/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  private Url: string;
  private headers = new HttpHeaders();
  private health = 'v1/webapi/';

  constructor(
    private _settingService: SettingsService,
    private _http: HttpClient,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.setHeaders();
    this.Url = _settingService.apiOmnicanal;
  }

  private getSucursalRandom(): string {
    return this._settingService.sucursales[
      Math.floor(Math.random() * this._settingService.sucursales.length)
    ].toString();
  }

  public getSucursal(): Observable<Sucursal> {
    let url = `${this._settingService.apiOmnicanal}${this.health}getSucursalFromIP`;
    const sucursal = this.getSucursalRandom();
    url = url.replace('#', sucursal);
    return this._http.get<Sucursal>(url, { headers: this.headers });
  }

  public getSucursalByNumber(sucursalnumber: string): Observable<Sucursal> {
    let url = `${this._settingService.apiOmnicanal}${this.health}getSucursalByNumber`;
    const sucursal = this.getSucursalRandom();
    url = url.replace('#', sucursal);
    const urlFinal = `${url}?sucursalnumber=${sucursalnumber}`;
    return this._http.get<Sucursal>(urlFinal, { headers: this.headers });
  }

  private setHeaders(): void {
    this.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'
    );
    this.headers.set('Content-Type', 'application/json');
  }

  public setSucursalInStorage(sucursal: Sucursal): void {
    this.storage.set('nroSucursal', sucursal);
  }

  public getSucursalFromStorage(): Sucursal {
    return this.storage.get('nroSucursal');
  }

  public removeSucursalFromStorage(): void {
    this.storage.remove('nroSucursal');
  }
}
