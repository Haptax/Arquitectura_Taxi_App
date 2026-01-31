import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/iuser.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
