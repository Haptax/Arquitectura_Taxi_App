import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../../domain/repositories/iuser.repository';
import { User, UserRole } from '../../../../../domain/entities/user.entity';
import { UserOrmEntity } from '../../entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const ormUser = this.ormRepository.create({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      passwordHash: user.passwordHash,
    });
    await this.ormRepository.save(ormUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;
    return new User(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.role as UserRole,
      ormUser.isActive,
      ormUser.passwordHash,
    );
  }

  async findById(id: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { id } });
    if (!ormUser) return null;
    return new User(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.role as UserRole,
      ormUser.isActive,
      ormUser.passwordHash,
    );
  }

  async findAll(): Promise<User[]> {
    const users = await this.ormRepository.find();
    return users.map(
      (ormUser) =>
        new User(
          ormUser.id,
          ormUser.name,
          ormUser.email,
          ormUser.role as UserRole,
          ormUser.isActive,
          ormUser.passwordHash,
        ),
    );
  }
}