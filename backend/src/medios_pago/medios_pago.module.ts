import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedioPago } from './medios_pago.entity';
import { MedioPagoService } from './medios_pago.service';
import { MedioPagoController } from './medios_pago.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedioPago])],
  controllers: [MedioPagoController],
  providers: [MedioPagoService],
  exports: [MedioPagoService]
})
export class MedioPagoModule {}
