import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoIva } from './tipo_iva.entity';

@Injectable()
export class TipoIvaService {
  constructor(
    @InjectRepository(TipoIva)
    private repo: Repository<TipoIva>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: any) {
    return this.repo.findOneBy({ codigo: id } as any);
  }

  create(data: any) {
    const newEntity = this.repo.create(data as Partial<TipoIva>);
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
