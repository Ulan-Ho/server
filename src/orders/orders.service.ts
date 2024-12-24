import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Stripe from 'stripe'

@Injectable()
export class OrdersService {
    private stripe: Stripe

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }

    async placeOrder(total: number) {
        if ( total < 0.5 ) {
            throw new Error('Order total must be at least 50 cents')
        }

        console.log('total', total)

        const totalInTenge = Math.round(total * 500);

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: total,
            currency: 'kzt',
            automatic_payment_methods: {
                enabled: true
            },
            description: 'Order payment',
        });

        return { clientSecret: paymentIntent.client_secret }    
    }
}
