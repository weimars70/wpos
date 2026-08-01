import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryColumn()
  codigo: number;
  @Column({ name: 'tipoident', nullable: true })
  tipoident: string;
  @Column({ name: 'ident', nullable: true })
  ident: string;
  @Column({ name: 'nombre', nullable: false })
  nombre: string;
  @Column({ name: 'direccion', nullable: true })
  direccion: string;
  @Column({ name: 'telefono', nullable: true })
  telefono: string;
  @Column({ name: 'movil', nullable: true })
  movil: string;
  @Column({ name: 'fecha', nullable: true })
  fecha: string;
  @Column({ name: 'usuario', nullable: true })
  usuario: string;
  @Column({ name: 'firma', nullable: true })
  firma: string;
  @Column({ name: 'profesion', nullable: true })
  profesion: string;
  @Column({ name: 'activo', nullable: true })
  activo: boolean;
}
