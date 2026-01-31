import { Injectable } from '@nestjs/common';
import { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';
import { Driver } from '../../domain/entities/driver.entity';
import { Trip } from '../../domain/entities/trip.entity';

@Injectable()
export class RatedDriverStrategy implements IDriverAssignmentStrategy {
	selectDriver(drivers: Driver[], _trip: Trip): Driver | null {
		if (!drivers.length) return null;

		return drivers.reduce((best, current) =>
			current.rating > best.rating ? current : best,
		);
	}
}
