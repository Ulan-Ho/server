// verify-otp.dto.ts
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @Length(6, 6, { message: 'OTP должен состоять из 6 символов' })
    otpCode: string;
}
