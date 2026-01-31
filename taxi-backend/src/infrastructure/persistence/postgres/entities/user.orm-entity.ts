import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../../domain/entities/user.entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;
}