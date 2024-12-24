import { IsNumberString, IsOptional, IsString, IsUUID } from "class-validator"

export class MedicationDto {
    
    @IsUUID()
    id: number;

    @IsString()
    name: string;

    @IsOptional()  // Made optional, as it is nullable in the model
    @IsString()
    description?: string;

    @IsNumberString()  // We use number validation here
    price: number;  // Use 'number' instead of Float32Array

    @IsOptional()  // Made optional, as it is nullable in the model
    @IsString()
    manufacturer?: string;

    @IsOptional()  // Made optional, as it is nullable in the model
    @IsString()
    photoUrl?: string;
    
    createdAt: Date;
    updatedAt: Date;
}