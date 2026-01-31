import { Driver } from '../../domain/entities/driver.entity';
import { Trip } from '../../domain/entities/trip.entity';

export interface IDriverAssignmentStrategy {
	selectDriver(drivers: Driver[], trip: Trip): Driver | null;
}
