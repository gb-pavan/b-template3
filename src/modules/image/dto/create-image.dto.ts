import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ example: 'image.jpg' })
  filename: string;

  @ApiProperty({ example: '/uploads/image.jpg' })
  path: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimetype: string;
}
