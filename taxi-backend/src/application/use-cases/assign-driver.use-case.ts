import { Inject, Injectable } from '@nestjs/common';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import type { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';
import { Trip } from '../../domain/entities/trip.entity';
import { Driver } from '../../domain/entities/driver.entity';

@Injectable()
export class AssignDriverUseCase {
	constructor(
		@Inject('IDriverRepository')
		private readonly driverRepository: IDriverRepository,
		@Inject('DriverAssignmentStrategy')
		private readonly assignmentStrategy: IDriverAssignmentStrategy,
	) {}

	async execute(trip: Trip): Promise<Driver | null> {
		const availableDrivers = await this.driverRepository.findAvailable();
		const selected = this.assignmentStrategy.selectDriver(availableDrivers, trip);

		if (!selected) {
			return null;
		}

		await this.driverRepository.updateAvailability(selected.id, false);
		return selected;
	}
}
