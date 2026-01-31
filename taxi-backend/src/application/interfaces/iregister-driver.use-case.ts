import { CreateDriverDto } from '../dtos/create-driver.dto';
import { Driver } from '../../domain/entities/driver.entity';

export interface IRegisterDriverUseCase {
  execute(dto: CreateDriverDto): Promise<Driver>;
}
