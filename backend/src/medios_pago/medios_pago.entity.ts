import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('medios_pago')
export class MedioPago {
  @PrimaryColumn()
  codigo: number;
  @Column({ name: 'descripcion', nullable: false })
  descripcion: string;
  @Column({ name: 'abonos', nullable: true })
  abonos: boolean;
  @Column({ name: 'facturas', nullable: true })
  facturas: boolean;
  @Column({ name: 'devoluciones', nullable: true })
  devoluciones: boolean;
}
