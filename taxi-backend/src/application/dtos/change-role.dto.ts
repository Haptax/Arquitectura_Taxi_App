import { IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeRoleDto {
	@IsOptional()
	@Transform(({ value }) => (value === '' ? undefined : value))
	@IsString()
	@MinLength(6)
	password?: string;
}