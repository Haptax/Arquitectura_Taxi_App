import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTripDto } from '../dtos/create-trip.dto';
import type { ITripRepository } from '../../domain/repositories/itrip.repository';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import type { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';
import { Trip } from '../../domain/entities/trip.entity';

@Injectable()
export class RequestTripUseCase {
	constructor(
		@Inject('ITripRepository')
		private readonly tripRepository: ITripRepository,
		@Inject('IDriverRepository')
		private readonly driverRepository: IDriverRepository,
		@Inject('DriverAssignmentStrategy')
		private readonly assignmentStrategy: IDriverAssignmentStrategy,
	) {}

	async execute(dto: CreateTripDto): Promise<Trip> {
		const fare = this.calculateFare(
			dto.originLat,
			dto.originLng,
			dto.destinationLat,
			dto.destinationLng,
			dto.fare ?? undefined,
		);

		const trip = new Trip(
			uuidv4(),
			dto.clientId,
			dto.origin,
			dto.destination,
			fare,
			undefined,
			undefined,
			undefined,
			dto.originLat,
			dto.originLng,
			dto.destinationLat,
			dto.destinationLng,
		);

		await this.tripRepository.save(trip);

		return trip;
	}

	private calculateFare(
		originLat?: number,
		originLng?: number,
		destLat?: number,
		destLng?: number,
		fallbackFare?: number,
	): number {
		if (
			originLat == null ||
			originLng == null ||
			destLat == null ||
			destLng == null
		) {
			return fallbackFare ?? 10;
		}

		const distance = Math.hypot(originLat - destLat, originLng - destLng);
		const baseFare = 3;
		const perKm = 8;
		const km = distance * 111;
		return Math.max(baseFare + km * perKm, baseFare);
	}
}
