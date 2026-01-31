import { Profile } from '../../domain/entities/profile.entity';

export interface IGetProfileUseCase {
  execute(userId: string): Promise<Profile | null>;
}
