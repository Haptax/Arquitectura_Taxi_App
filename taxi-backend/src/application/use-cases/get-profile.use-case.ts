import { Inject, Injectable } from '@nestjs/common';
import type { IProfileRepository } from '../../domain/repositories/iprofile.repository';
import { Profile } from '../../domain/entities/profile.entity';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<Profile | null> {
    return this.profileRepository.findByUserId(userId);
  }
}
