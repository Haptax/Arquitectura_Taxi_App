import { Controller, Get, Post, Body, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { User } from '../../domain/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RegisterAdminUseCase } from '../../application/use-cases/register-admin.use-case';
import { RegisterAdminDto } from '../../application/dtos/register-admin.dto';
import { ChangeUserRoleUseCase } from '../../application/use-cases/change-user-role.use-case';
import { ChangeRoleDto } from '../../application/dtos/change-role.dto';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(registerUserDto);
    return this.toSafeUser(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    const users = await this.listUsersUseCase.execute();
    return users.map((user) => this.toSafeUser(user));
  }

  @Post('admin/register')
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    const user = await this.registerAdminUseCase.execute(dto);
    return this.toSafeUser(user);
  }

  @Post('change-role')
  @UseGuards(JwtAuthGuard)
  async changeRole(@Body() _dto: ChangeRoleDto, @Req() req: Request) {
    const userId = (req as any).user?.sub as string | undefined;
    if (!userId) {
      throw new ForbiddenException('No autorizado');
    }

    const user = await this.changeUserRoleUseCase.execute(userId);
    return this.toSafeUser(user);
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}