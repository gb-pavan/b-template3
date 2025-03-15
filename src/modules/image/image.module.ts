import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule to access PrismaService
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
