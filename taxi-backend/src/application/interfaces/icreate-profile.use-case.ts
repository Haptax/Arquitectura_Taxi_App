import { CreateProfileDto } from '../dtos/create-profile.dto';
import { Profile } from '../../domain/entities/profile.entity';

export interface ICreateProfileUseCase {
  execute(dto: CreateProfileDto): Promise<Profile>;
}
