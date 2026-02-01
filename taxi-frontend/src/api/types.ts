export type UserRole = 'client' | 'driver' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type Profile = {
  id: string;
  userId: string;
  role: UserRole;
  permissions: string[];
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  currentLat: number;
  currentLng: number;
  isAvailable: boolean;
};

export type TripStatus = 'requested' | 'assigned' | 'in_progress' | 'completed' | 'canceled';

export type Trip = {
  id: string;
  clientId: string;
  origin: string;
  destination: string;
  fare: number;
  status: TripStatus;
  driverId?: string;
  offerDriverId?: string;
  paid?: boolean;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
};
