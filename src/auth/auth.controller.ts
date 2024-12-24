import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenDto } from './dto/refrence-token.dto';
import { Auth } from './decorators/auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwt: JwtService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  @Auth()
  async getNewsToken(@Body() dto: refreshTokenDto) {
    return this.authService.getNewsToken(dto.refreshToken);
  }

  @Post('send-otp')
  async sendOtp(@Body() SendOtpDto: SendOtpDto ): Promise<string> {
    return this.authService.sendOtp(SendOtpDto.phoneNumber);
  }

  @Post('verify-otp')
  async verifyOtp( @Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.phoneNumber, verifyOtpDto.otpCode);
  }

}
