import { Driver } from '../entities/driver.entity';

export interface IDriverRepository {
  save(driver: Driver): Promise<void>;
  findAvailable(): Promise<Driver[]>;
  findById(id: string): Promise<Driver | null>;
  updateAvailability(id: string, isAvailable: boolean): Promise<void>;
}
