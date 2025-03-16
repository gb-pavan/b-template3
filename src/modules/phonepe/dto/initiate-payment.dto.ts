import { IsInt, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsInt()
  amount: number;

  @IsNotEmpty()
  userId: string;
}
