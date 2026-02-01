export enum UserRole {
  CLIENT = 'client',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly isActive: boolean = true,
    public readonly passwordHash?: string,
  ) {}
}