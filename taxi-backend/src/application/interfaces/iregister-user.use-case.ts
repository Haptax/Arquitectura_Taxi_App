import { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../../domain/entities/user.entity';

export interface IRegisterUserUseCase {
  execute(dto: RegisterUserDto): Promise<User>;
}
