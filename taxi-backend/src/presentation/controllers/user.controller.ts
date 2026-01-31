import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.registerUserUseCase.execute(registerUserDto);
  }

  @Get()
  async list() {
    return await this.listUsersUseCase.execute();
  }
}