import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async getAppointments() {
    const doctors = await this.prisma.appointment.findMany({
      select: {
        doctor: {
          select: {
            name: true,
            id: true,
            avatarUrl: true,
            specialty: true,
            profession: true,
            rating: true,
            reviews: true
          }
        },
        clinicAddress: true,
        appointmentDate: true,
      },
      distinct: ['doctorId'], // Ожидаем, что каждый врач будет возвращен только один раз
    });
  
    // console.log(doctors.map((appointment) => appointment.doctor.avatarUrl));
    // Возвращаем информацию о всех врачах
    return doctors;
  }


  async cancelAppointment(userId: number) {
    return await this.prisma.user.findMany({
      where: {
        role: 'doctor',
        doctorAppointments: {
          some: {
            userId,
            status: 'cancelled',
          },
        },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        profession: true,
      },
    });
  }

  async getCompletedAppointments(userId: number) {
    return this.prisma.appointment.findMany({
      where: {
        userId: userId,  // Пациент, чьи записи ищем
        status: 'completed',  // Статус завершенной записи
      },
      select: {
        appointmentDate: true,  // Дата завершения
        clinicAddress: true,
        id: true,
        doctor: {  // Информация о враче
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            profession: true,
          },
        },
      },
    });
  }


  async getUpcomingAppointments(userId: number) {
    return this.prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentDate: {
          gt: new Date(), // только будущие записи
        },
      },
      select: {
        id: true,
        appointmentDate: true, // Дата и время записи
        clinicAddress: true,   // Адрес клиники
        doctor: {              // Информация о враче
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            profession: true,
          },
        },
      },
    });
  }

  async markAppointmentAsCompleted(appointmentId: number) {
    if (!appointmentId) {
      throw new Error('Invalid appointment ID');
    }
    return this.prisma.appointment.update({
      where: {
        id: appointmentId, // ID записи, которую нужно обновить
      },
      data: {
        status: 'completed', // Изменяем статус на 'completed'
      },
    });
  }
  
  async getAppointmentsForDoctor(doctorId: number) {
    return this.prisma.appointment.findMany({
      where: {
        doctorId,
      },
      take: 10, // Ограничиваем количеством записей
      orderBy: {
        appointmentDate: 'asc', // Можно настроить порядок, например, по дате
      },
      include: {
        user: true, // Информация о пациенте
        doctor: true, // Информация о враче
      },
    });
  }
}
