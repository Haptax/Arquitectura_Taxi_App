import { User } from '../../domain/entities/user.entity';

export interface IListUsersUseCase {
  execute(): Promise<User[]>;
}
