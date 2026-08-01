import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talla } from './tallas.entity';

@Injectable()
export class TallaService {
  constructor(
    @InjectRepository(Talla)
    private repo: Repository<Talla>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(codigo: any) {
    return this.repo.findOneBy({ codigo: codigo } as any);
  }

  create(data: any) {
    const newEntity = this.repo.create(data as Partial<Talla>);
    return this.repo.save(newEntity);
  }

  async update(codigo: any, data: any) {
    await this.repo.update(codigo, data);
    return this.findOne(codigo);
  }

  remove(codigo: any) {
    return this.repo.delete(codigo);
  }
}
