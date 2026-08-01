import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './empleados.entity';
import { EmpleadoService } from './empleados.service';
import { EmpleadoController } from './empleados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService]
})
export class EmpleadoModule {}
