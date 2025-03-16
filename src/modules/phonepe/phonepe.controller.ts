// import { Controller, Post, Get, Body, Param } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { PhonePeService } from './phonepe.service';
// import { InitiatePaymentDto } from './dto/initiate-payment.dto';
// import { ValidatePaymentDto } from './dto/validate-payment.dto';

// @ApiTags('PhonePe')
// @Controller('phonepe')
// export class PhonePeController {
//   constructor(private readonly phonePeService: PhonePeService) {}

//   @Post('pay')
//   @ApiOperation({ summary: 'Initiate Payment' })
//   @ApiResponse({ status: 200, description: 'Payment initiated successfully' })
//   @ApiResponse({ status: 400, description: 'Invalid request' })
//   async initiatePayment(@Body() dto: InitiatePaymentDto) {
//     return this.phonePeService.initiatePayment(dto);
//   }

//   @Get('validate/:merchantTransactionId')
//   @ApiOperation({ summary: 'Validate Payment' })
//   @ApiResponse({ status: 200, description: 'Payment status fetched successfully' })
//   @ApiResponse({ status: 400, description: 'Invalid request' })
//   async validatePayment(@Param() params: ValidatePaymentDto) {
//     return this.phonePeService.validatePayment(params);
//   }
// }

import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PhonePeService } from './phonepe.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ValidatePaymentDto } from './dto/validate-payment.dto';

@ApiTags('PhonePe')
@Controller('phonepe')
export class PhonePeController {
  constructor(private readonly phonePeService: PhonePeService) {}

  @Post('pay')
  @ApiOperation({ summary: 'Initiate Payment' })
  @ApiResponse({ status: 200, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', example: 'M123456789' },
        merchantTransactionId: { type: 'string', example: 'TXN987654321' },
        amount: { type: 'integer', example: 50000, description: 'Amount in paise (₹500 = 50000)' },
        redirectUrl: { type: 'string', example: 'https://yourwebsite.com/payment-success' },
        callbackUrl: { type: 'string', example: 'https://yourapi.com/payment-callback' },
        paymentInstrument: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'UPI' },
            upiId: { type: 'string', example: 'user@upi' }
          }
        }
      }
    }
  })
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    console.log('Initiate Payment Request:', dto);
    console.log('PHONEPE_MERCHANT_ID:', process.env.PHONEPE_MERCHANT_ID);
    console.log('PHONEPE_HOST_URL:', process.env.PHONEPE_HOST_URL);
    console.log('SALT_KEY:', process.env.SALT_KEY);
    console.log('SALT_INDEX:', process.env.SALT_INDEX);
    console.log('APP_BE_URL:', process.env.APP_BE_URL);

    return this.phonePeService.initiatePayment(dto);
  }

  @Get('validate/:merchantTransactionId')
  @ApiOperation({ summary: 'Validate Payment' })
  @ApiResponse({ status: 200, description: 'Payment status fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'merchantTransactionId',
    required: true,
    description: 'Unique transaction ID to validate payment',
    example: 'TXN987654321'
  })
  async validatePayment(@Param() params: ValidatePaymentDto) {
    return this.phonePeService.validatePayment(params);
  }
}


