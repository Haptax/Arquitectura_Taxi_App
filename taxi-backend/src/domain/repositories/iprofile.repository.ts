import { Profile } from '../entities/profile.entity';

export interface IProfileRepository {
  save(profile: Profile): Promise<void>;
  findByUserId(userId: string): Promise<Profile | null>;
}
