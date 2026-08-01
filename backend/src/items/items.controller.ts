import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { unlink } from 'fs/promises';
import { ItemService } from './items.service';

@Controller('api/items')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  findAll(@Query('estado') estado?: string) {
    return this.service.findAll(estado);
  }

  @Post('upload-imagen')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'items'),
      filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
        return cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImagen(@UploadedFile() file: any, @Body('oldUrl') oldUrl?: string) {
    if (oldUrl && oldUrl.startsWith('/uploads/items/')) {
      const oldPath = join(process.cwd(), 'uploads', 'items', basename(oldUrl));
      try {
        await unlink(oldPath);
      } catch {
        // el archivo anterior ya no existe, no pasa nada
      }
    }
    return { url: `/uploads/items/${file.filename}` };
  }

  @Get(':id/colores')
  getColores(@Param('id') id: string) {
    return this.service.getColores(id);
  }

  @Put(':id/colores')
  setColores(@Param('id') id: string, @Body() body: { colores: number[] }) {
    return this.service.setColores(id, body.colores);
  }

  @Get(':id/tallas')
  getTallas(@Param('id') id: string) {
    return this.service.getTallas(id);
  }

  @Put(':id/tallas')
  setTallas(@Param('id') id: string, @Body() body: { tallas: string[] }) {
    return this.service.setTallas(id, body.tallas);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
