import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('items_tallas')
export class ItemTalla {
  @PrimaryColumn({ name: 'item_codigo' })
  item_codigo: string;
  @PrimaryColumn({ name: 'talla' })
  talla: string;
}
