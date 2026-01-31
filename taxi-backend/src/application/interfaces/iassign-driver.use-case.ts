import { Trip } from '../../domain/entities/trip.entity';
import { Driver } from '../../domain/entities/driver.entity';

export interface IAssignDriverUseCase {
  execute(trip: Trip): Promise<Driver | null>;
}
