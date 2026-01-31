import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../../domain/entities/user.entity';

@Entity('profiles')
export class ProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ type: 'jsonb' })
  permissions: string[];
}
