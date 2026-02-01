import { Inject, Injectable } from '@nestjs/common';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import { Driver } from '../../domain/entities/driver.entity';

@Injectable()
export class ListDriversUseCase {
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(onlyAvailable = false): Promise<Driver[]> {
    return onlyAvailable
      ? this.driverRepository.findAvailable()
      : this.driverRepository.findAll();
  }
}
