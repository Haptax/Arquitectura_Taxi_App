import { Inject, Injectable } from '@nestjs/common';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import { Driver } from '../../domain/entities/driver.entity';

@Injectable()
export class UpdateDriverLocationUseCase {
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(driverId: string, lat: number, lng: number): Promise<Driver> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error('Conductor no encontrado');
    }

    await this.driverRepository.updateLocation(driverId, lat, lng);
    const updated = await this.driverRepository.findById(driverId);
    if (!updated) {
      throw new Error('Conductor no encontrado');
    }

    return updated;
  }
}
