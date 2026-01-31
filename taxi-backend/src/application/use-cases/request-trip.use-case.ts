import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTripDto } from '../dtos/create-trip.dto';
import type { ITripRepository } from '../../domain/repositories/itrip.repository';
import { Trip } from '../../domain/entities/trip.entity';
import { AssignDriverUseCase } from './assign-driver.use-case';

@Injectable()
export class RequestTripUseCase {
	constructor(
		@Inject('ITripRepository')
		private readonly tripRepository: ITripRepository,
		private readonly assignDriverUseCase: AssignDriverUseCase,
	) {}

	async execute(dto: CreateTripDto): Promise<Trip> {
		const trip = new Trip(
			uuidv4(),
			dto.clientId,
			dto.origin,
			dto.destination,
			dto.fare,
			undefined,
			undefined,
			dto.originLat,
			dto.originLng,
			dto.destinationLat,
			dto.destinationLng,
		);

		await this.tripRepository.save(trip);

		const driver = await this.assignDriverUseCase.execute(trip);
		if (driver) {
			trip.assignDriver(driver.id);
			await this.tripRepository.save(trip);
		}

		return trip;
	}
}
