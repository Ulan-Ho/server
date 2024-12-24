import { Controller, Get } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { PrismaService } from 'src/prisma.service';
import { returnMedicationObject } from './return-medication.object';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  async getAllMedications() {
    return this.medicationService.getAllMedications();
  }


  // async search(search: string) {
  //   return this.prisma.medication.findMany({
  //     where: {
  //       OR: [
  //         {
  //           name: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           description: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           manufacturer: {
  //             contains: search,
  //             mode: 'insensitive',
  //           },
  //         },
  //       ],
  //     }
  //   }); 
  // }
}
