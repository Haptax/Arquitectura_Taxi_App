import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TripStatus } from '../../../../domain/entities/trip.entity';

@Entity('trips')
export class TripOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'float' })
  fare: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.REQUESTED,
  })
  status: TripStatus;

  @Column({ nullable: true })
  driverId?: string;

  @Column({ nullable: true })
  offerDriverId?: string;

  @Column({ type: 'float', nullable: true })
  originLat?: number;

  @Column({ type: 'float', nullable: true })
  originLng?: number;

  @Column({ type: 'float', nullable: true })
  destinationLat?: number;

  @Column({ type: 'float', nullable: true })
  destinationLng?: number;
}
