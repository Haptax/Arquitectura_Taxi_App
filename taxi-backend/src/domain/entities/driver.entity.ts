export class Driver {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly rating: number,
		public readonly currentLat: number,
		public readonly currentLng: number,
		public isAvailable: boolean = true,
	) {}
}
