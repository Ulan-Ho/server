import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MedicationService {
    
    constructor(private prisma: PrismaService) {}

    async getAllMedications() {
        return this.prisma.medication.findMany();
    }
}
