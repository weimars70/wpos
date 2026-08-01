import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tallas')
export class Talla {
  @PrimaryColumn()
  codigo: string;
  @Column({ name: 'nombre', nullable: false })
  nombre: string;
}
