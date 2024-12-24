import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUrl, Min } from 'class-validator';

export class CreateMedicationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    manufacturer?: string;

    @IsUrl()
    @IsOptional()
    photoUrl?: string;

    @IsNumber()
    @Min(0)
    stockQuantity: number;
}
