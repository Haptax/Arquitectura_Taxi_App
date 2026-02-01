import { Inject, Injectable } from '@nestjs/common';
import type { ITripRepository } from '../../domain/repositories/itrip.repository';
import { Trip, TripStatus } from '../../domain/entities/trip.entity';

@Injectable()
export class ListTripsUseCase {
  constructor(
    @Inject('ITripRepository')
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(filters: { status?: TripStatus; driverId?: string } = {}): Promise<Trip[]> {
    if (filters.status) {
      return this.tripRepository.findByStatus(filters.status);
    }
    if (filters.driverId) {
      return this.tripRepository.findByDriverId(filters.driverId);
    }
    return this.tripRepository.findAll();
  }
}
