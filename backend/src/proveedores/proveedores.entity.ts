import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryColumn()
  codigo: string;
  @Column({ name: 'ident', nullable: true })
  ident: string;
  @Column({ name: 'nombre', nullable: false })
  nombre: string;
  @Column({ name: 'nombre_comercial', nullable: true })
  nombre_comercial: string;
  @Column({ name: 'contacto', nullable: true })
  contacto: string;
  @Column({ name: 'telefono1', nullable: true })
  telefono1: string;
  @Column({ name: 'telefono2', nullable: true })
  telefono2: string;
  @Column({ name: 'fax', nullable: true })
  fax: string;
  @Column({ name: 'email', nullable: true })
  email: string;
  @Column({ name: 'observaciones', nullable: true })
  observaciones: string;
  @Column({ name: 'fecha', nullable: true })
  fecha: string;
  @Column({ name: 'usuario', nullable: true })
  usuario: string;
  @Column({ name: 'tipo_ident', nullable: true })
  tipo_ident: string;
  @Column({ name: 'direccion', nullable: true })
  direccion: string;
}
