import { Inject, Injectable } from '@nestjs/common';
import type { ITripRepository } from '../../domain/repositories/itrip.repository';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import type { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';
import { Trip, TripStatus } from '../../domain/entities/trip.entity';

@Injectable()
export class AcceptTripUseCase {
  constructor(
    @Inject('ITripRepository')
    private readonly tripRepository: ITripRepository,
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
    @Inject('DriverAssignmentStrategy')
    private readonly assignmentStrategy: IDriverAssignmentStrategy,
  ) {}

  async execute(tripId: string, driverId: string): Promise<Trip> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new Error('Viaje no encontrado');
    }
    if (trip.status !== TripStatus.REQUESTED) {
      throw new Error('El viaje ya fue tomado');
    }

    const driver = await this.driverRepository.findById(driverId);
    if (!driver || !driver.isAvailable) {
      throw new Error('Conductor no disponible');
    }

    const availableDrivers = await this.driverRepository.findAvailable();
    const nearest =
      this.assignmentStrategy.selectDriver(availableDrivers, trip) ??
      availableDrivers[0] ??
      null;

    trip.assignDriver(driverId);
    await this.tripRepository.save(trip);
    await this.driverRepository.updateAvailability(driverId, false);

    return trip;
  }
}
