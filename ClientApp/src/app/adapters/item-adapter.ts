import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { ItemModelDto } from '../datos-delivery/dto/itemModelDto';
import { Item } from '../datos-delivery/Models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemAdapter implements Adapter<Item> {
  adapt(itemDto: ItemModelDto): Item {
    return new Item(
      itemDto.codbarra,
      itemDto.cuf,
      itemDto.descripcion,
      itemDto.cantidad
    );
  }
}
