// import { Injectable } from '@nestjs/common';
// import { TwilioService } from './twilio.service';
// import { PrismaService } from '../prisma.service';
// import * as crypto from 'crypto';

// @Injectable()
// export class AuthService {
//     constructor(private twilioService: TwilioService, private prisma: PrismaService) {}

//     async sendOTP(phoneNumber: string): Promise<void> {
//         const otpCode = crypto.randomInt(100000, 999999).toString();
//         const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//         await this.prisma.oTP.create({
//         data: { phoneNumber, otpCode, expiresAt },
//         });

//         await this.twilioService.sendSMS(phoneNumber, `Ваш код подтверждения: ${otpCode}`);
//     }

//     async verifyOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
//         const otp = await this.prisma.oTP.findFirst({
//         where: { phoneNumber, otpCode },
//         });

//         if (!otp || new Date() > otp.expiresAt) {
//         return false;
//         }

//         await this.prisma.oTP.update({
//         where: { id: otp.id },
//         data: { verified: true },
//         });

//         return true;
//     }
// }

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service'; // Подключите ваш Prisma-сервис
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Twilio } from 'twilio';

// @Injectable()
// export class AuthService {
//     private twilioClient: Twilio;

//     constructor(
//         private readonly prisma: PrismaService,
//         private readonly jwtService: JwtService,
//         private readonly configService: ConfigService,
//     ) {
//         this.twilioClient = new Twilio(
//         this.configService.get('TWILIO_ACCOUNT_SID'),
//         this.configService.get('TWILIO_AUTH_TOKEN'),
//         );
//     }

//     async sendOtp(phoneNumber: string): Promise<string> {
//         const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация 6-значного OTP
//         const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

//         // Сохранение OTP в БД
//         await this.prisma.oTP.create({
//         data: {
//             phoneNumber,
//             otpCode,
//             expiresAt,
//         },
//         });

//         // Отправка SMS через Twilio
//         await this.twilioClient.messages.create({
//             body: `Ваш код для входа: ${otpCode}`,
//             from: this.configService.get<string>('TWILIO_PHONE_NUMBER'), // Должно быть зарегистрировано в Twilio
//             to: phoneNumber,
//         });

//         return 'Код отправлен';
//     }

//     async verifyOtp(phoneNumber: string, otpCode: string): Promise<{ token: string }> {
//         const otpRecord = await this.prisma.oTP.findFirst({
//         where: {
//             phoneNumber,
//             otpCode,
//             expiresAt: { gt: new Date() }, // Проверка на истечение
//             verified: false,
//         },
//         });
//         console.log(otpRecord);


//         if (!otpRecord) {
//         throw new Error('Неверный или истёкший код');
//         }

//         // Обновление записи как проверенной
//         await this.prisma.oTP.update({
//         where: { id: otpRecord.id },
//         data: { verified: true },
//         });

//         // Генерация JWT
//         const token = this.jwtService.sign({ phoneNumber });

//         return { token };
//     }
// }

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Подключите ваш Prisma-сервис
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    private twilioClient: Twilio;

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private readonly configService: ConfigService,
    ) {
        // Инициализация Twilio клиента
        this.twilioClient = new Twilio(
            this.configService.get('TWILIO_ACCOUNT_SID'),
            this.configService.get('TWILIO_AUTH_TOKEN'),
        );
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Генерация 6-значного OTP
    }

    private calculateExpirationTime(): Date {
        return new Date(Date.now() + 5 * 60 * 1000); // OTP истекает через 5 минут
    }

    // Отправка OTP на номер телефона
    async sendOtp(phoneNumber: string): Promise<string> {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация 6-значного OTP
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
    
        // Сохранение OTP в БД, но без связывания с пользователем
        await this.prisma.oTP.create({
            data: {
                otpCode,
                expiresAt,
                phoneNumber: phoneNumber,
            },
        });
    
        try {
            await this.twilioClient.messages.create({
                body: `Ваш код для входа: ${otpCode}`,
                from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
                to: phoneNumber,
            });
        } catch (error) {
            console.error('Ошибка при отправке SMS:', error);
            throw new BadRequestException('Не удалось отправить SMS. Проверьте номер телефона.');
        }
        
    
        return 'Код отправлен';
    }
    

    // Проверка и верификация OTP
    async verifyOtp(phoneNumber: string, otpCode: string) {
        // Проверка OTP в базе данных
        console.log("otp", otpCode, "number", phoneNumber)
        const otpRecord = await this.prisma.oTP.findFirst({
            where: {
                phoneNumber,
                otpCode,
                expiresAt: { gt: new Date() }, // Проверка на истечение
                verified: false,
            },
        });
        console.log("Найденная запись OTP:", otpRecord);

        if (!otpRecord || otpRecord == null) {
            return {
                status: 'error',
                error: 'Неправильный код или истекший срок'
            }
        }
    
        // Обновление записи OTP как проверенной
        await this.prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });
    
        // Создание нового пользователя в базе данных
        const oldUser = await this.prisma.user.findFirst({
            where: {
                phoneNumber: phoneNumber,
            }
        });

        if (oldUser) {
            // const user = await this.validateUser(phoneNumber);
            const tokens = await this.issueTokens(oldUser.id);

            return {
                user: this.returnUserFields(oldUser),
                ...tokens,
                status: 'login'
            }
        }  

        const user = await this.prisma.user.create({
            data: {
                phoneNumber: phoneNumber,
                role: 'patient', // Пример роли, можно указать другую
                name: 'New user', // Укажите имя или другие данные, если нужно
                birthday: new Date(), // Укажите дату рождения или другие данные, если нужно
            },
        });
    
        // Генерация JWT
        const tokens = await this.issueTokens(user.id);
    
        return { 
            user: this.returnUserFields(user),
            ...tokens,
            status: "register" 
        };
    }
    
    async login(dto: AuthDto) {
        const user = await this.validateUser(dto.phoneNumber);
        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    async getNewsToken(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);
        if(!result) throw new UnauthorizedException('Invalid refresh token');

        const user = await this.prisma.user.findUnique({
            where: {
                id: result.id,
            }
        });

        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }
    async register(dto: AuthDto) {
        const oldUser = await this.prisma.user.findFirst({
            where: {
                phoneNumber: dto.phoneNumber,
            }
        });

        if (oldUser) throw new BadRequestException('Пользователь с таким номером телефона уже существует');

        const user = await this.prisma.user.create({
            data: {
                phoneNumber: dto.phoneNumber,
                role: dto.role ? dto.role : 'patient',
                name: dto.name,
                birthday: dto.birthday ? dto.birthday : new Date(),
                avatarUrl: faker.image.avatar(),
            }
        });

        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    private async issueTokens(userId: number) {
        const data = { id: userId };

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    private returnUserFields(user: User) {
        return {
            id: user.id,
            phoneNumber: user.phoneNumber,
        }
    }

    private async validateUser(phoneNumber: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        });

        if (!user) throw new NotFoundException('Пользователь с таким номером телефона уже существует');

        const isValid = await verify(user.phoneNumber, phoneNumber);
        if (!isValid) throw new UnauthorizedException('Invalid credentials provided');
        
        return user;
    }
}
