import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProfileDto } from '../../application/dtos/create-profile.dto';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return this.createProfileUseCase.execute(dto);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.getProfileUseCase.execute(userId);
  }
}
