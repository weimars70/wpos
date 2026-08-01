import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './proveedores.entity';
import { ProveedorService } from './proveedores.service';
import { ProveedorController } from './proveedores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedorController],
  providers: [ProveedorService],
  exports: [ProveedorService]
})
export class ProveedorModule {}
