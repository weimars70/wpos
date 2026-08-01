import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios', schema: 'public', synchronize: false })
export class User {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @PrimaryColumn({ name: 'empresa_id', type: 'int' })
  empresaId: number;

  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phone: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({ type: 'text', nullable: true })
  usuario: string | null;
}
