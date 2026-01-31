import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserFactory } from '../../domain/factories/user.factory';
import type { IUserRepository } from '../../domain/repositories/iuser.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    // 1. Validar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El usuario con este correo ya existe');
    }

    // 2. Usar el PATRÓN FACTORY para crear la entidad de dominio [cite: 5, 76]
    const newUser = UserFactory.create(dto.name, dto.email, dto.role);

    // 3. Usar el PATRÓN REPOSITORY para persistir 
    await this.userRepository.save(newUser);

    return newUser;
  }
}