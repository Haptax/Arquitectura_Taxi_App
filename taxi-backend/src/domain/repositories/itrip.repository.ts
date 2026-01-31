import { Trip } from '../entities/trip.entity';

export interface ITripRepository {
	save(trip: Trip): Promise<void>;
	findById(id: string): Promise<Trip | null>;
}
