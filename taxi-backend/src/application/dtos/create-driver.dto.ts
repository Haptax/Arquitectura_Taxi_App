import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rating: number;

  @Type(() => Number)
  @IsNumber()
  currentLat: number;

  @Type(() => Number)
  @IsNumber()
  currentLng: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
