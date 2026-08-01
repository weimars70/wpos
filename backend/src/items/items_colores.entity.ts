import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('items_colores')
export class ItemColor {
  @PrimaryColumn({ name: 'item_codigo' })
  item_codigo: string;
  @PrimaryColumn({ name: 'color_codigo' })
  color_codigo: number;
}
