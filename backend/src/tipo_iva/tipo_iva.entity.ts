import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('items_tipo_iva')
export class TipoIva {
  @PrimaryColumn()
  codigo: string;
  @Column({ name: 'descripcion', nullable: false })
  descripcion: string;
}
