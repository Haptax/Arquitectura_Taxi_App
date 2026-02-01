export enum TripStatus {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export class Trip {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly origin: string,
    public readonly destination: string,
    public readonly fare: number,
    public status: TripStatus = TripStatus.REQUESTED,
    public driverId?: string,
    public offerDriverId?: string,
    public originLat?: number,
    public originLng?: number,
    public destinationLat?: number,
    public destinationLng?: number,
  ) {}

  assignDriver(driverId: string) {
    this.driverId = driverId;
    this.status = TripStatus.ASSIGNED;
  }

  offerTo(driverId: string) {
    this.offerDriverId = driverId;
    this.status = TripStatus.REQUESTED;
  }
}
