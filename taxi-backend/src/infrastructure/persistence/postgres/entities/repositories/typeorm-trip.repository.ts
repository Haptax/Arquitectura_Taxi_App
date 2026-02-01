import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { ITripRepository } from '../../../../../domain/repositories/itrip.repository';
import { TripOrmEntity } from '../trip.orm-entity';

@Injectable()
export class TypeOrmTripRepository implements ITripRepository {
  constructor(
    @InjectRepository(TripOrmEntity)
    private readonly ormRepository: Repository<TripOrmEntity>,
  ) {}

  async save(trip: Trip): Promise<void> {
    const ormTrip = this.ormRepository.create({
      id: trip.id,
      clientId: trip.clientId,
      origin: trip.origin,
      destination: trip.destination,
      fare: trip.fare,
      status: trip.status,
      driverId: trip.driverId,
      offerDriverId: trip.offerDriverId,
      originLat: trip.originLat,
      originLng: trip.originLng,
      destinationLat: trip.destinationLat,
      destinationLng: trip.destinationLng,
    });

    await this.ormRepository.save(ormTrip);
  }

  async findById(id: string): Promise<Trip | null> {
    const trip = await this.ormRepository.findOne({ where: { id } });
    if (!trip) return null;

    return new Trip(
      trip.id,
      trip.clientId,
      trip.origin,
      trip.destination,
      trip.fare,
      trip.status,
      trip.driverId,
      trip.offerDriverId,
      trip.originLat,
      trip.originLng,
      trip.destinationLat,
      trip.destinationLng,
    );
  }
  
  async findAll(): Promise<Trip[]> {
    const trips = await this.ormRepository.find();
    return trips.map(
      (trip) =>
        new Trip(
          trip.id,
          trip.clientId,
          trip.origin,
          trip.destination,
          trip.fare,
          trip.status,
          trip.driverId,
          trip.offerDriverId,
          trip.originLat,
          trip.originLng,
          trip.destinationLat,
          trip.destinationLng,
        ),
    );
  }
  
  async findByStatus(status: Trip['status']): Promise<Trip[]> {
    const trips = await this.ormRepository.find({ where: { status } });
    return trips.map(
      (trip) =>
        new Trip(
          trip.id,
          trip.clientId,
          trip.origin,
          trip.destination,
          trip.fare,
          trip.status,
          trip.driverId,
          trip.offerDriverId,
          trip.originLat,
          trip.originLng,
          trip.destinationLat,
          trip.destinationLng,
        ),
    );
  }
  
  async findByDriverId(driverId: string): Promise<Trip[]> {
    const trips = await this.ormRepository.find({ where: { driverId } });
    return trips.map(
      (trip) =>
        new Trip(
          trip.id,
          trip.clientId,
          trip.origin,
          trip.destination,
          trip.fare,
          trip.status,
          trip.driverId,
          trip.offerDriverId,
          trip.originLat,
          trip.originLng,
          trip.destinationLat,
          trip.destinationLng,
        ),
    );
  }
}
