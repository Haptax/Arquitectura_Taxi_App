import { IsString, MinLength } from 'class-validator';

export class ChangeRoleDto {
  @IsString()
  @MinLength(6)
  password: string;
}