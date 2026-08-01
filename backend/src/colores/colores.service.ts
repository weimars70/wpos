import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './colores.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private repo: Repository<Color>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: any) {
    return this.repo.findOneBy({ id: id } as any);
  }

  create(data: any) {
    const newEntity = this.repo.create(data as Partial<Color>);
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
