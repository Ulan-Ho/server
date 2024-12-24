// send-otp.dto.ts
import { IsPhoneNumber, IsString } from 'class-validator';

export class SendOtpDto {
    // @IsString()
    phoneNumber: string;
}
