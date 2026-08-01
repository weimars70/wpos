import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryColumn()
  item: string;
  @Column({ name: 'descripcion', nullable: false })
  descripcion: string;
  @Column({ name: 'grupo_codigo', nullable: true })
  grupo_codigo: number;
  @Column({ name: 'por_iva', nullable: true })
  por_iva: number;
  @Column({ name: 'por_ganmin', nullable: true })
  por_ganmin: number;
  @Column({ name: 'por_ganmax', nullable: true })
  por_ganmax: number;
  @Column({ name: 'activo', nullable: true })
  activo: boolean;
  @Column({ name: 'item_tipo_iva', nullable: true })
  item_tipo_iva: string;
  @Column({ name: 'imagen', nullable: true })
  imagen: string;
  @Column({ name: 'color', nullable: true })
  color: number;
  @Column({ name: 'ult_pcompra', nullable: true })
  ult_pcompra: number;
  @Column({ name: 'ult_pventa', nullable: true })
  ult_pventa: number;
  @Column({ name: 'tallas', nullable: true })
  tallas: string;
  @Column({ name: 'precio_venta2', nullable: true })
  precio_venta2: number;
  @Column({ name: 'precio_venta3', nullable: true })
  precio_venta3: number;
  @Column({ name: 'promocion', nullable: true })
  promocion: number;
}
