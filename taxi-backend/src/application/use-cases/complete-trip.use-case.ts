import { Inject, Injectable } from '@nestjs/common';
import type { ITripRepository } from '../../domain/repositories/itrip.repository';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import { Trip, TripStatus } from '../../domain/entities/trip.entity';

@Injectable()
export class CompleteTripUseCase {
  constructor(
    @Inject('ITripRepository')
    private readonly tripRepository: ITripRepository,
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(tripId: string, driverId: string): Promise<Trip> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new Error('Viaje no encontrado');
    }
    if (trip.driverId !== driverId) {
      throw new Error('No autorizado para completar este viaje');
    }

    trip.status = TripStatus.COMPLETED;
    await this.tripRepository.save(trip);
    await this.driverRepository.updateAvailability(driverId, true);

    return trip;
  }
}
