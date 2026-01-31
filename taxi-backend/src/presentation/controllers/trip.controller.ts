import { Body, Controller, Post } from '@nestjs/common';
import { CreateTripDto } from '../../application/dtos/create-trip.dto';
import { RequestTripUseCase } from '../../application/use-cases/request-trip.use-case';

@Controller('trips')
export class TripController {
	constructor(private readonly requestTripUseCase: RequestTripUseCase) {}

	@Post('request')
	async requestTrip(@Body() dto: CreateTripDto) {
		return await this.requestTripUseCase.execute(dto);
	}
}
