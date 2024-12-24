import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService, PrismaService],
})
export class MedicationModule {}
