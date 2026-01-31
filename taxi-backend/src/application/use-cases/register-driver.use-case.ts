import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import { Driver } from '../../domain/entities/driver.entity';
import { CreateDriverDto } from '../dtos/create-driver.dto';

@Injectable()
export class RegisterDriverUseCase {
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(dto: CreateDriverDto): Promise<Driver> {
    const driver = new Driver(
      uuidv4(),
      dto.name,
      dto.rating,
      dto.currentLat,
      dto.currentLng,
      dto.isAvailable ?? true,
    );

    await this.driverRepository.save(driver);
    return driver;
  }
}
