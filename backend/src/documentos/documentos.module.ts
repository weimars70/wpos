import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './documentos.entity';
import { DocumentoService } from './documentos.service';
import { DocumentoController } from './documentos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Documento])],
  controllers: [DocumentoController],
  providers: [DocumentoService],
  exports: [DocumentoService]
})
export class DocumentoModule {}
