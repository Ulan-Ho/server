import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
    private twilioClient: Twilio;

    constructor(private configService: ConfigService) {
        this.twilioClient = new Twilio(
        this.configService.get<string>('TWILIO_ACCOUNT_SID'),
        this.configService.get<string>('TWILIO_AUTH_TOKEN'),
        );
    }

    async sendSMS(to: string, message: string): Promise<void> {
        await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to,
        });
    }
}
