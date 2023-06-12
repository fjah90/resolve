import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, observable } from 'rxjs';
import { SpinnerService } from 'src/services/spinner.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ServiceGen {
  constructor(private http: HttpClient, private spinner: SpinnerService) {}

  // GENERACION DE API GENERICA
  // getAll(NombreTabla: string, Top?: number, Id?: number, Data?: string): Observable<any> {
  //     const req = environment.serverAPI + 'api/PortalSuc' + '?NombreTabla=' + NombreTabla +
  //                 (Top !== undefined ? '&Top=' + Top : '') +
  //                 (Id !== undefined ? '&Id=' + Id : '') +
  //                 (Data !== undefined ? '&data=' + Data : '');

  //     const rtaGet = this.http.get(req);
  //     return rtaGet;
  // }

  // post(Data: Array<any>) {
  //     // console.log(JSON.stringify(Data), 'esta en formato json');
  //     return this.http.post(environment.serverAPI + 'api/PortalSuc', Data);
  // }
}
