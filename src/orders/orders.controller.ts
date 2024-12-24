import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import Stripe from 'stripe';

@Controller('orders')
export class OrdersController {
  private stripe: Stripe;
  constructor(private readonly ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  @Post()
  async createPaymentIntent(@Body() body: { total: number }) {
    const { total } = body;
    if ( total < 0.5 ) {
      throw new Error('Order total must be at least 50 cents')
  }

  console.log('total', total)

  const totalInTenge = Math.round(total * 100);

  const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalInTenge,
      currency: 'kzt',
      automatic_payment_methods: {
          enabled: true
      },
      description: 'Order payment',
  });
  console.log('clientSecret', paymentIntent.client_secret) 
  return { clientSecret: paymentIntent.client_secret }   
  }
}
