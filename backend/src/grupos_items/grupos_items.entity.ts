import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('items_grupos')
export class GrupoItem {
  @PrimaryColumn()
  codigo: number;
  @Column({ name: 'descripcion', nullable: false })
  descripcion: string;
}
