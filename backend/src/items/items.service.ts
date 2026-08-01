import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Item } from './items.entity';
import { ItemColor } from './items_colores.entity';
import { ItemTalla } from './items_tallas.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private repo: Repository<Item>,
    @InjectRepository(ItemColor)
    private itemColorRepo: Repository<ItemColor>,
    @InjectRepository(ItemTalla)
    private itemTallaRepo: Repository<ItemTalla>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  findAll(estado?: string) {
    let where = '';
    if (estado === 'activos') where = 'WHERE activo = true';
    else if (estado === 'inactivos') where = 'WHERE activo = false';
    return this.dataSource.query(
      `SELECT item, descripcion, grupo_codigo, grupo, por_iva, por_ganmin, por_ganmax,
              activo, item_tipo_iva, tipo_iva, imagen, ult_pcompra, ult_pventa,
              precio2, precio3, promocion
       FROM view_items
       ${where}
       ORDER BY item`,
    );
  }

  findOne(id: any) {
    return this.repo.findOneBy({ item: id } as any);
  }

  create(data: any) {
    const newEntity = this.repo.create(data as Partial<Item>);
    return this.repo.save(newEntity);
  }

  async update(id: any, data: any) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: any) {
    return this.repo.delete(id);
  }

  getColores(item: string) {
    return this.dataSource.query(
      `SELECT k.id AS color_codigo, k.nombre
       FROM items_colores ic
       JOIN colores k ON k.id = ic.color_codigo
       WHERE ic.item_codigo = $1
       ORDER BY k.nombre`,
      [item],
    );
  }

  async setColores(item: string, colores: number[]) {
    await this.itemColorRepo.delete({ item_codigo: item });
    if (colores && colores.length) {
      const rows = colores.map((c) => this.itemColorRepo.create({ item_codigo: item, color_codigo: c }));
      await this.itemColorRepo.save(rows);
    }
    return this.getColores(item);
  }

  getTallas(item: string) {
    return this.dataSource.query(
      `SELECT t.codigo AS talla, t.nombre
       FROM items_tallas it
       JOIN tallas t ON t.codigo = it.talla
       WHERE it.item_codigo = $1
       ORDER BY t.nombre`,
      [item],
    );
  }

  async setTallas(item: string, tallas: string[]) {
    await this.itemTallaRepo.delete({ item_codigo: item });
    if (tallas && tallas.length) {
      const rows = tallas.map((t) => this.itemTallaRepo.create({ item_codigo: item, talla: t }));
      await this.itemTallaRepo.save(rows);
    }
    return this.getTallas(item);
  }
}
