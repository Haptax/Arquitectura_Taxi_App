import { CreateTripDto } from '../dtos/create-trip.dto';
import { Trip } from '../../domain/entities/trip.entity';

export interface IRequestTripUseCase {
  execute(dto: CreateTripDto): Promise<Trip>;
}
