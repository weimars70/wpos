import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('tipo_ident')
export class Documento {
  @PrimaryColumn()
  codigo: string;
  @Column({ name: 'nombre', nullable: false })
  nombre: string;
  @Column({ name: 'abreviado', nullable: true })
  abreviado: string;
}
