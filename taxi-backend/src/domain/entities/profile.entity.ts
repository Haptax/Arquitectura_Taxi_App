import { UserRole } from './user.entity';

export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly permissions: string[],
  ) {}
}
