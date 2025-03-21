import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  // async create(createImageDto: CreateImageDto) {
  //   return this.prisma.image.create({ data: createImageDto });
  // }

  async create(createImageDto: CreateImageDto) {
  try {
    const image = await this.prisma.image.create({ data: createImageDto });
    console.log("Image saved:", image);
    return image;
  } catch (error) {
    console.error("Error inserting image:", error);
    throw error;
  }
}


  async findAll() {
    return this.prisma.image.findMany();
  }

  async findOne(id: string) {
    return this.prisma.image.findUnique({ where: { id } });
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    return this.prisma.image.update({ where: { id }, data: updateImageDto });
  }

  async remove(id: string) {
    return this.prisma.image.delete({ where: { id } });
  }
}

