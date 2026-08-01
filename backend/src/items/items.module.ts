import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ItemColor } from './items_colores.entity';
import { ItemTalla } from './items_tallas.entity';
import { ItemService } from './items.service';
import { ItemController } from './items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemColor, ItemTalla])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
