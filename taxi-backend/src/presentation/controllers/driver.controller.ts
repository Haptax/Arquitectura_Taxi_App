import { Body, Controller, Get, Post, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { CreateDriverDto } from '../../application/dtos/create-driver.dto';
import { RegisterDriverUseCase } from '../../application/use-cases/register-driver.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ListDriversUseCase } from '../../application/use-cases/list-drivers.use-case';
import { UpdateDriverLocationUseCase } from '../../application/use-cases/update-driver-location.use-case';
import { UpdateDriverLocationDto } from '../../application/dtos/update-driver-location.dto';
import type { Request } from 'express';

@Controller('drivers')
export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly listDriversUseCase: ListDriversUseCase,
    private readonly updateDriverLocationUseCase: UpdateDriverLocationUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateDriverDto) {
    return this.registerDriverUseCase.execute(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Query('available') available?: string) {
    const onlyAvailable = available === 'true';
    return this.listDriversUseCase.execute(onlyAvailable);
  }

  @Post('location')
  @UseGuards(JwtAuthGuard)
  async updateLocation(@Body() dto: UpdateDriverLocationDto, @Req() req: Request) {
    const driverId = (req as any).user?.sub as string | undefined;
    if (!driverId) {
      throw new ForbiddenException('No autorizado');
    }
    return this.updateDriverLocationUseCase.execute(driverId, dto.currentLat, dto.currentLng);
  }
}
