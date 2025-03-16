import { IsInt, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsInt()
  amount: number;

  @IsNotEmpty()
  userId: string;
}

// import { IsString, IsInt, IsObject, IsOptional, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// class PaymentInstrumentDto {
//   @IsString()
//   type: string;

//   @IsString()
//   @IsOptional()
//   upiId?: string;
// }

// export class InitiatePaymentDto {
//   @IsString()
//   merchantId: string;

//   @IsString()
//   merchantTransactionId: string;

//   @IsInt()
//   amount: number; // Amount in paise (e.g., ₹500 = 50000)

//   @IsString()
//   redirectUrl: string;

//   @IsString()
//   callbackUrl: string;

//   @IsObject()
//   @ValidateNested()
//   @Type(() => PaymentInstrumentDto)
//   paymentInstrument: PaymentInstrumentDto;
// }
