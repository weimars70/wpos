import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('colores')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'nombre', nullable: false })
  nombre: string;
}
