import { Trip, TripStatus } from '../entities/trip.entity';

export interface ITripRepository {
	save(trip: Trip): Promise<void>;
	findById(id: string): Promise<Trip | null>;
	findAll(): Promise<Trip[]>;
	findByStatus(status: TripStatus): Promise<Trip[]>;
	findByDriverId(driverId: string): Promise<Trip[]>;
}
