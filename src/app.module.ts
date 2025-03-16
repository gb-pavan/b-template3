// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ImageModule } from './modules/image/image.module';

// @Module({
//   imports: [ImageModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ImageModule } from './modules/image/image.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PhonePeModule } from './modules/phonepe/phonepe.module';
@Module({
  imports: [ImageModule,PrismaModule, PhonePeModule],
})
export class AppModule {}

