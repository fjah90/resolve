import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ConfigurationFile, Endpoint } from 'src/model/config-file.model';
// import * as config from '../assets/configs/config.json';

export function  appInit(settings: SettingsService) {
  return settings.Init();
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public config: ConfigurationFile;
  public apiOmnicanal: string;
  public branchOffice: string;
  public editarSucursal: string;
  public sucursales: Array<number> = [];

  constructor(private http: HttpClient) {}

  public Init(): (() => Promise<boolean>) {
    return (): Promise<boolean> => {
      return new Promise<boolean>((resolve: (a: boolean) => void): void => {
         this.http.get('../assets/configs/config.json')
           .pipe(
             map((res: ConfigurationFile) => {
               res as ConfigurationFile;
               this.config = res;
               this.apiOmnicanal = this.config.endpoints['omni'].uri;
               this.editarSucursal = this.config.editarSucursal;
               this.sucursales = this.config.sucursales;
               resolve(true);
             })
           ).subscribe();
      });
    };
  }

  public setBranchOffice(branchoffice: string): void {
    this.branchOffice = branchoffice;
  }

  public getUrlWithOfficeId() {
    return this.apiOmnicanal.replace('#', this.branchOffice);
  }
}
