import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/patient/')
  async fetchUsersWithMedications(@Body('doctorId') doctorId: number) {
    return this.userService.fetchUsersWithMedications(doctorId);
  }

  // @Get()
  // async findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.userService.findOne(Number(id));
  // }

  // @Post()
  // async create(@Body() data: any) {
  //   return this.userService.create(data);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() data: any) {
  //   return this.userService.update(Number(id), data);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.userService.delete(Number(id));
  // }
}
