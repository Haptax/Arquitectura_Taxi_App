import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../../../../domain/entities/driver.entity';
import { IDriverRepository } from '../../../../../domain/repositories/idriver.repository';
import { DriverOrmEntity } from '../driver.orm-entity';

@Injectable()
export class TypeOrmDriverRepository implements IDriverRepository {
  constructor(
    @InjectRepository(DriverOrmEntity)
    private readonly ormRepository: Repository<DriverOrmEntity>,
  ) {}

  async save(driver: Driver): Promise<void> {
    const ormDriver = this.ormRepository.create({
      id: driver.id,
      name: driver.name,
      rating: driver.rating,
      currentLat: driver.currentLat,
      currentLng: driver.currentLng,
      isAvailable: driver.isAvailable,
    });

    await this.ormRepository.save(ormDriver);
  }

  async findAvailable(): Promise<Driver[]> {
    const drivers = await this.ormRepository.find({ where: { isAvailable: true } });
    return drivers.map(
      (driver) =>
        new Driver(
          driver.id,
          driver.name,
          driver.rating,
          driver.currentLat,
          driver.currentLng,
          driver.isAvailable,
        ),
    );
  }

  async findById(id: string): Promise<Driver | null> {
    const driver = await this.ormRepository.findOne({ where: { id } });
    if (!driver) return null;

    return new Driver(
      driver.id,
      driver.name,
      driver.rating,
      driver.currentLat,
      driver.currentLng,
      driver.isAvailable,
    );
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<void> {
    await this.ormRepository.update({ id }, { isAvailable });
  }
}
