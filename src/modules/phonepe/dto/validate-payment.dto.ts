import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePaymentDto {
  @IsString()
  @IsNotEmpty()
  merchantTransactionId: string;
}
