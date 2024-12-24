import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async fetchUsersWithMedications(doctorId: number) {
    const users = await this.prisma.user.findMany({
      where: {
        appointments: {
          some: {
            doctorId: doctorId, // ID конкретного врача
          },
        },
      },  
      include: {
        appointments: {
          where: {
            doctorId: doctorId, // Фильтрация назначений по врачу
          },
        },
        medications: {
          include: {
            medication: true, // Включает детали медикаментов
          },
        },
        receivedPrescriptions: {
          include: {
            medications: true, // Включает данные о рецептах
          },
        },
      },
    });

    // console.log(users);
  
    return users;
  }

  // async findAll() {
  //   return this.prisma.user.findMany();
  // }

  // async findOne(id: number) {
  //   return this.prisma.user.findUnique({
  //     where: { id },
  //   });
  // }

  // async create(data: any) {
  //   return this.prisma.user.create({ data });
  // }

  // async update(id: number, data: any) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async delete(id: number) {
  //   return this.prisma.user.delete({
  //     where: { id },
  //   });
  // }
}
