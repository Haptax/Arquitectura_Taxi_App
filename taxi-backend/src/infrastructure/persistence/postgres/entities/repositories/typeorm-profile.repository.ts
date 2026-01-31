import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../../../../domain/entities/profile.entity';
import { IProfileRepository } from '../../../../../domain/repositories/iprofile.repository';
import { ProfileOrmEntity } from '../profile.orm-entity';

@Injectable()
export class TypeOrmProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(ProfileOrmEntity)
    private readonly ormRepository: Repository<ProfileOrmEntity>,
  ) {}

  async save(profile: Profile): Promise<void> {
    const ormProfile = this.ormRepository.create({
      id: profile.id,
      userId: profile.userId,
      role: profile.role,
      permissions: profile.permissions,
    });

    await this.ormRepository.save(ormProfile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.ormRepository.findOne({ where: { userId } });
    if (!profile) return null;

    return new Profile(profile.id, profile.userId, profile.role, profile.permissions);
  }
}
