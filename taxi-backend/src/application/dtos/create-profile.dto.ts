import { IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class CreateProfileDto {
  @IsString()
  userId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
