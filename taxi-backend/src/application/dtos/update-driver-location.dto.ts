import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateDriverLocationDto {
  @Type(() => Number)
  @IsNumber()
  currentLat: number;

  @Type(() => Number)
  @IsNumber()
  currentLng: number;
}
