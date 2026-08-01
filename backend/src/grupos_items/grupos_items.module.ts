import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoItem } from './grupos_items.entity';
import { GrupoItemService } from './grupos_items.service';
import { GrupoItemController } from './grupos_items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoItem])],
  controllers: [GrupoItemController],
  providers: [GrupoItemService],
  exports: [GrupoItemService]
})
export class GrupoItemModule {}
