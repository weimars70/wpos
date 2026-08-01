import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './colores.entity';
import { ColorService } from './colores.service';
import { ColorController } from './colores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService]
})
export class ColorModule {}
