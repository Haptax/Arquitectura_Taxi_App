import { Body, Controller, Post } from '@nestjs/common';
import { CreateDriverDto } from '../../application/dtos/create-driver.dto';
import { RegisterDriverUseCase } from '../../application/use-cases/register-driver.use-case';

@Controller('drivers')
export class DriverController {
  constructor(private readonly registerDriverUseCase: RegisterDriverUseCase) {}

  @Post()
  async create(@Body() dto: CreateDriverDto) {
    return this.registerDriverUseCase.execute(dto);
  }
}
