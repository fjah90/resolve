import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { ListItem } from './model/listItem';
import * as data from '../../../assets/data/menuItems.json';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { ObservatorSucursal } from 'src/app/shared/observators/sucursal-observator';
import { version } from '../../../../package.json';
import { OmnicanalService } from 'src/services/omnicanal.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  listItems: ListItem[] = data.menuItems;
  show: boolean[];
  @Output() onToggleMenu = new EventEmitter();
  apiVersion: string;
  version: string;
  constructor(
    private router: Router,
    private alert: AlertService,
    private observatorSucursal: ObservatorSucursal,
    private _omnicanalService: OmnicanalService
  ) {}

  ngOnInit() {
    this._getVersion();
    this.version = version.replace('-', '.');
  }

  showElemento(item: ListItem) {
    item.show = !item.show;
  }

  toggleClick() {
    this.onToggleMenu.emit();
  }

  private _getVersion() {
    this._omnicanalService.getVersion().subscribe((response) => {
      this.apiVersion = response;
    });
  }

  public goToPath(path: string): void {
    if (sessionStorage['nroSucursal']) {
      this.observatorSucursal.notifyCambioSucursal(
        sessionStorage['nroSucursal']
      );
      this.router.navigate([path]);
    } else {
      this.alert.info(
        'Debe configurar una sucursal para poder utilizar el sistema'
      );
    }
  }
}
