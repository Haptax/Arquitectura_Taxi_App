import { Inject, Injectable } from '@nestjs/common';
import { UserFactory } from '../../domain/factories/user.factory';
import type { IUserRepository } from '../../domain/repositories/iuser.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import type { IPasswordHasher } from '../interfaces/ipassword-hasher';
import { RegisterAdminDto } from '../dtos/register-admin.dto';

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterAdminDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El usuario con este correo ya existe');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const newUser = UserFactory.create(dto.name, dto.email, UserRole.ADMIN, passwordHash);
    await this.userRepository.save(newUser);

    return new User(newUser.id, newUser.name, newUser.email, newUser.role, newUser.isActive);
  }
}