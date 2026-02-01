import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { CreateTripDto } from '../../application/dtos/create-trip.dto';
import { RequestTripUseCase } from '../../application/use-cases/request-trip.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ListTripsUseCase } from '../../application/use-cases/list-trips.use-case';
import { AcceptTripUseCase } from '../../application/use-cases/accept-trip.use-case';
import { CompleteTripUseCase } from '../../application/use-cases/complete-trip.use-case';
import type { Request } from 'express';

@Controller('trips')
export class TripController {
	constructor(
		private readonly requestTripUseCase: RequestTripUseCase,
		private readonly listTripsUseCase: ListTripsUseCase,
		private readonly acceptTripUseCase: AcceptTripUseCase,
		private readonly completeTripUseCase: CompleteTripUseCase,
	) {}

	@Post('request')
	@UseGuards(JwtAuthGuard)
	async requestTrip(@Body() dto: CreateTripDto) {
		return await this.requestTripUseCase.execute(dto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async list(@Query('status') status?: string, @Query('driverId') driverId?: string) {
		return this.listTripsUseCase.execute({
			status: status as any,
			driverId,
		});
	}

	@Post(':id/accept')
	@UseGuards(JwtAuthGuard)
	async accept(@Param('id') id: string, @Req() req: Request) {
		const driverId = (req as any).user?.sub as string | undefined;
		if (!driverId) {
			throw new ForbiddenException('No autorizado');
		}
		return this.acceptTripUseCase.execute(id, driverId);
	}

	@Post(':id/complete')
	@UseGuards(JwtAuthGuard)
	async complete(@Param('id') id: string, @Req() req: Request) {
		const driverId = (req as any).user?.sub as string | undefined;
		if (!driverId) {
			throw new ForbiddenException('No autorizado');
		}
		return this.completeTripUseCase.execute(id, driverId);
	}
}
