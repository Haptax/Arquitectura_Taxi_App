import { Inject, Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileFactory } from '../../domain/factories/profile.factory';
import type { IProfileRepository } from '../../domain/repositories/iprofile.repository';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(dto: CreateProfileDto): Promise<Profile> {
    const profile = ProfileFactory.create(dto.userId, dto.role);
    await this.profileRepository.save(profile);
    return profile;
  }
}
