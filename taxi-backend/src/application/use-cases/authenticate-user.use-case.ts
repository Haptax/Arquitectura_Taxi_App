import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/iuser.repository';
import type { IPasswordHasher } from '../interfaces/ipassword-hasher';
import type { ITokenService } from '../interfaces/itoken-service';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(email: string, password: string): Promise<{ accessToken: string }>{
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
