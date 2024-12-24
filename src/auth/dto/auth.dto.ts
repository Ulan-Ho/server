import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {
    // @IsOptional()
    @IsNumberString()
    phoneNumber: string;

    @IsString()
    name: string;

    @IsString()
    role: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    birthday: Date;
}