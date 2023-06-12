import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ObservatorSucursal } from 'src/app/shared/observators/sucursal-observator';
import { AlertService } from 'src/services/alert.service';
import * as data from '../../../assets/data/menuItems.json';
import { ListItem } from '../side-nav/model/listItem';

@Component({
  selector: 'app-side-nav-icons',
  templateUrl: './side-nav-icons.component.html',
  styleUrls: ['./side-nav-icons.component.css'],
})
export class SideNavIconsComponent implements OnInit {
  listItems: ListItem[] = data.menuItems;
  show: boolean[];
  @Output() onToggleMenu = new EventEmitter();

  constructor(
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private alert: AlertService,
    private observatorSucursal: ObservatorSucursal
  ) {}

  ngOnInit() {}

  toggleClick() {
    this.onToggleMenu.emit();
  }

  showElemento(item: ListItem) {
    item.show = !item.show;
  }

  public goToPath(path: string): void {
    if (this.storage.get('nroSucursal')) {
      this.observatorSucursal.notifyCambioSucursal(
        this.storage.get('nroSucursal')
      );
      this.router.navigate([path]);
    } else {
      this.alert.info(
        'Debe configurar una sucursal para poder utilizar el sistema'
      );
    }
  }
}
