import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ValidatePaymentDto } from './dto/validate-payment.dto';
import axios from 'axios';
import * as sha256 from 'sha256';
import * as uniqid from 'uniqid';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PhonePeService {
  private readonly PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
  private readonly PHONEPE_HOST_URL = process.env.PHONEPE_HOST_URL;
  private readonly SALT_KEY = process.env.SALT_KEY;
  private readonly SALT_INDEX = process.env.SALT_INDEX;
  private readonly APP_BE_URL = process.env.APP_BE_URL;

  constructor(private readonly prisma: PrismaService) {}

  async initiatePayment(dto: InitiatePaymentDto) {
    let userId = "MUID123";
    
    const merchantTransactionId = uniqid();
    const payload = {
      merchantId: this.PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: dto.amount * 100,
      redirectUrl: `${this.APP_BE_URL}/phonepe/validate/${merchantTransactionId}`,
      redirectMode: 'REDIRECT',
      mobileNumber: '9999999999',
      paymentInstrument: { type: 'PAY_PAGE' },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    console.log('Sending request to PhonePe:', payload);

    const checksum = sha256(base64Payload + '/pg/v1/pay' + this.SALT_KEY) + '###' + this.SALT_INDEX;

    // try {
    //   const response = await axios.post(
    //     `${this.PHONEPE_HOST_URL}/pg/v1/pay`,
    //     { request: base64Payload },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'X-VERIFY': checksum,
    //         accept: 'application/json',
    //       },
    //       validateStatus: () => true,  // ✅ Prevents automatic retries
    //     },
    //   );

    //   await this.prisma.payment.create({
    //     data: { merchantTransactionId, amount: dto.amount, userId: dto.userId, status: 'PENDING' },
    //   });

    //   return response.data;
    // } catch (error) {
    //   throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    // }
    try {
  const response = await axios.post(
    `${this.PHONEPE_HOST_URL}/pg/v1/pay`,
    { request: base64Payload },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        accept: 'application/json',
      },
      validateStatus: () => true, // Prevent Axios from throwing errors on non-2xx responses
    }
  );

  console.log('PhonePe API Response:', response?.data); // Debugging log

  if (!response || !response.data) {
    throw new Error('Invalid response from PhonePe API');
  }

  return response.data;
} catch (error) {
  console.error('Error from PhonePe API:', error.response?.data || error.message);
  throw new HttpException(error.response?.data || 'Payment initiation failed', HttpStatus.BAD_REQUEST);
}

  }

  async validatePayment(dto: ValidatePaymentDto) {
    const statusUrl = `${this.PHONEPE_HOST_URL}/pg/v1/status/${this.PHONEPE_MERCHANT_ID}/${dto.merchantTransactionId}`;
    const checksum = sha256(`/pg/v1/status/${this.PHONEPE_MERCHANT_ID}/${dto.merchantTransactionId}` + this.SALT_KEY) + '###' + this.SALT_INDEX;

    try {
      const response = await axios.get(statusUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          accept: 'application/json',
        },
      });

      const status = response.data.code === 'PAYMENT_SUCCESS' ? 'SUCCESS' : 'FAILED';

      await this.prisma.payment.update({
        where: { merchantTransactionId: dto.merchantTransactionId },
        data: { status },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    }
  }
}

