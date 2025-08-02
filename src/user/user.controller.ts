import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.create(userDto);
  }

  @Get('getAll')
  async getAll() {
    return await this.userService.getAll();
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() userDto: UpdateUserDto) {
    return await this.userService.update(id, userDto);
  }
}
