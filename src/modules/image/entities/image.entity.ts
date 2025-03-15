import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty({ example: '656f1b5d9d123456789abcd' })
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  createdAt: Date;
}
