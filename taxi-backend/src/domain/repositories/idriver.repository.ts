import { Driver } from '../entities/driver.entity';

export interface IDriverRepository {
  save(driver: Driver): Promise<void>;
  findAvailable(): Promise<Driver[]>;
  findAll(): Promise<Driver[]>;
  findById(id: string): Promise<Driver | null>;
  updateAvailability(id: string, isAvailable: boolean): Promise<void>;
  updateLocation(id: string, currentLat: number, currentLng: number): Promise<void>;
}
