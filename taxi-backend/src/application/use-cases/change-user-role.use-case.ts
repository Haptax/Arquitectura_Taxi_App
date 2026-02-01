import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/iuser.repository';
import type { IPasswordHasher } from '../interfaces/ipassword-hasher';
import type { IProfileRepository } from '../../domain/repositories/iprofile.repository';
import type { IDriverRepository } from '../../domain/repositories/idriver.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { ProfileFactory } from '../../domain/factories/profile.factory';
import { Driver } from '../../domain/entities/driver.entity';

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(userId: string, password: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.passwordHash) {
      throw new Error('Usuario no encontrado');
    }

    if (user.role !== UserRole.CLIENT) {
      throw new Error('Solo clientes pueden convertirse en conductores');
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const updated = new User(
      user.id,
      user.name,
      user.email,
      UserRole.DRIVER,
      user.isActive,
      user.passwordHash,
    );

    await this.userRepository.save(updated);

    const existingProfile = await this.profileRepository.findByUserId(user.id);
    const profile = ProfileFactory.create(user.id, UserRole.DRIVER);
    if (existingProfile) {
      await this.profileRepository.save({
        ...profile,
        id: existingProfile.id,
      });
    } else {
      await this.profileRepository.save(profile);
    }

    const existingDriver = await this.driverRepository.findById(user.id);
    if (!existingDriver) {
      const driver = new Driver(user.id, user.name, 5, 0, 0, true);
      await this.driverRepository.save(driver);
    } else {
      await this.driverRepository.updateAvailability(user.id, true);
    }

    return new User(updated.id, updated.name, updated.email, updated.role, updated.isActive);
  }
}