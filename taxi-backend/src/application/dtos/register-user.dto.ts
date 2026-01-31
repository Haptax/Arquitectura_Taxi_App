import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}