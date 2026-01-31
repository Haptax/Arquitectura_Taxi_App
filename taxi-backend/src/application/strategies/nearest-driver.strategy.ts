import { Injectable } from '@nestjs/common';
import { IDriverAssignmentStrategy } from '../interfaces/idriver-assignment.strategy';
import { Driver } from '../../domain/entities/driver.entity';
import { Trip } from '../../domain/entities/trip.entity';

@Injectable()
export class NearestDriverStrategy implements IDriverAssignmentStrategy {
	selectDriver(drivers: Driver[], trip: Trip): Driver | null {
		if (!drivers.length) return null;

		if (trip.originLat == null || trip.originLng == null) {
			return drivers[0] ?? null;
		}

		const { originLat, originLng } = trip;
		let selected = drivers[0];
		let minDistance = this.distance(originLat, originLng, selected.currentLat, selected.currentLng);

		for (const driver of drivers.slice(1)) {
			const d = this.distance(originLat, originLng, driver.currentLat, driver.currentLng);
			if (d < minDistance) {
				minDistance = d;
				selected = driver;
			}
		}

		return selected;
	}

	private distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
		const dLat = lat1 - lat2;
		const dLng = lng1 - lng2;
		return Math.sqrt(dLat * dLat + dLng * dLng);
	}
}
