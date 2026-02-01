import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from '../../application/dtos/create-profile.dto';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateProfileDto) {
    return this.createProfileUseCase.execute(dto);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getByUserId(@Param('userId') userId: string) {
    return this.getProfileUseCase.execute(userId);
  }
}
