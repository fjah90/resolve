import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { SucursalService } from 'src/app/shared/services/sucursal.service';
import { Sucursal } from 'src/app/sucursal/models/Sucursal';
// import { InternalUser } from 'src/app/internalUser/model/internalUser';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private userBehaviorSubject = new BehaviorSubject<any>(undefined);
  currentUser = this.userBehaviorSubject.asObservable();

  private tokenBehaviorSubject = new BehaviorSubject<string>(undefined);
  currentToken = this.tokenBehaviorSubject.asObservable();

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private sucursalService: SucursalService
  ) {}

  // setUser(newUser: InternalUser) {
  //   this.userBehaviorSubject.next(newUser);
  //   this.storeOnLocalStorage(newUser, 'USER');
  // }

  setToken(newToken: string) {
    this.tokenBehaviorSubject.next(newToken);
    this.storeOnLocalStorage(newToken, 'jwt');
  }

  private storeOnLocalStorage(data: any, key: string): void {
    this.storage.set(key, data);
  }

  private readFromLocalStorage<T>(key: string): T {
    return this.storage.get(key);
  }

  getUser(): any {
    return this.storage.get('USER');
  }

  getCurrentUrl(): string {
    return this.storage.get('currentUrl');
  }

  getCurrentBranchOffice(): Sucursal {
    return this.storage.get('nroSucursal');
  }

  clearLocalStorage() {
    this.setToken(null);
    // this.setUser(null);

    this.storage.clear();
  }

  dataStoreEmpty(): boolean {
    return this.storage.get('jwt') === undefined;
  }

  checkDataStore() {
    if (!this.dataStoreEmpty()) {
      const token = this.readFromLocalStorage('jwt');
      const user = this.readFromLocalStorage('USER');

      this.setToken(token as string);
      // this.setUser(user as InternalUser);
    }
  }
}
