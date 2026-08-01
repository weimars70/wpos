import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talla } from './tallas.entity';
import { TallaService } from './tallas.service';
import { TallaController } from './tallas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Talla])],
  controllers: [TallaController],
  providers: [TallaService],
  exports: [TallaService]
})
export class TallaModule {}
