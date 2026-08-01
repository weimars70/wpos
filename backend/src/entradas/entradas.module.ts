import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradasController } from './entradas.controller';
import { EntradasService } from './entradas.service';

@Module({
  controllers: [EntradasController],
  providers: [EntradasService],
})
export class EntradasModule {}
