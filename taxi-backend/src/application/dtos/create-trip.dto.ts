import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTripDto {
	@IsString()
	clientId: string;

	@IsString()
	origin: string;

	@IsString()
	destination: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	fare?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	originLat?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	originLng?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	destinationLat?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	destinationLng?: number;
}
