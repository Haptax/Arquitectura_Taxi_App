import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../domain/entities/user.entity';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  role?: UserRole;
}