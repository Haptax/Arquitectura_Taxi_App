import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../entities/profile.entity';
import { UserRole } from '../entities/user.entity';

export class ProfileFactory {
  static create(userId: string, role: UserRole): Profile {
    const permissions = this.permissionsByRole(role);
    return new Profile(uuidv4(), userId, role, permissions);
  }

  private static permissionsByRole(role: UserRole): string[] {
    switch (role) {
      case UserRole.ADMIN:
        return ['manage_users', 'manage_system', 'view_reports'];
      case UserRole.DRIVER:
        return ['accept_trips', 'update_location', 'view_earnings'];
      case UserRole.CLIENT:
      default:
        return ['request_trip', 'view_trips', 'rate_driver'];
    }
  }
}
