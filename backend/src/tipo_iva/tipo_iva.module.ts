import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoIva } from './tipo_iva.entity';
import { TipoIvaService } from './tipo_iva.service';
import { TipoIvaController } from './tipo_iva.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoIva])],
  controllers: [TipoIvaController],
  providers: [TipoIvaService],
  exports: [TipoIvaService]
})
export class TipoIvaModule {}
