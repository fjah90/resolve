import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class User {
  userAD: string;
  SucursalId: number;
  SucursalIdSel: number;
  CodUsuario: number;
  UserLogIn: boolean;
}
