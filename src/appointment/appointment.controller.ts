import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('/all')
  async getAppointments() {
    return this.appointmentService.getAppointments();
  }

  @HttpCode(200)
  @Post('cancel')
  async cancelAppointment(@Body('userId') userId: number) {
    return this.appointmentService.cancelAppointment(userId);
  }

  @HttpCode(200)
  @Post('completed')
  async getCompletedAppointments(@Body('userId') userId: number) {
    return this.appointmentService.getCompletedAppointments(userId);
  }

  @HttpCode(200)
  @Post('scheduled')
  async getUpcomingAppointments(@Body('userId') userId: number) {
    return this.appointmentService.getUpcomingAppointments(userId);
  }

  @HttpCode(200)
  @Post('mark/scheduled')
  async markAppointmentAsCompleted(@Body('userId') userId: number) {
    return this.appointmentService.markAppointmentAsCompleted(userId);
  }

  @Post('for-doctor')
  async getAppointmentsForDoctor(@Body('doctorId') doctorId: number) {
    return this.appointmentService.getAppointmentsForDoctor(doctorId);
  }

}
