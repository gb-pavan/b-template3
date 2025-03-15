import { Controller, Post, Get, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_, file, cb) => {
        cb(null, `${Date.now()}${extname(file.originalname)}`);
      }
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.create({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
    });
  }

  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}

