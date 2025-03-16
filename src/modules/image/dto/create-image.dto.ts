import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateImageDto {
  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  filename: string;

  @ApiProperty({ example: '/uploads/image.jpg' })
  @IsString()
  path: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  mimetype: string;
}
