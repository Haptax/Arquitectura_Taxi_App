import { Driver } from '../../domain/entities/driver.entity';
import { Trip } from '../../domain/entities/trip.entity';
import { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';

export class DriverFindingStrategy {
	constructor(private readonly strategy: IDriverAssignmentStrategy) {}

	selectDriver(drivers: Driver[], trip: Trip): Driver | null {
		return this.strategy.selectDriver(drivers, trip);
	}
}
