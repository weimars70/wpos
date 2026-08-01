import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedores.entity';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private repo: Repository<Proveedor>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: any) {
    return this.repo.findOneBy({ codigo: id } as any);
  }

  create(data: any) {
    const newEntity = this.repo.create(data as Partial<Proveedor>);
    return this.repo.save(newEntity);
  }

  async update(id: any, data: any) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: any) {
    return this.repo.delete(id);
  }
}
