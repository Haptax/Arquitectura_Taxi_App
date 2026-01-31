import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/persistence/postgres/database.module';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { TypeOrmUserRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/postgres/entities/user.orm-entity';
import { UserController } from './presentation/controllers/user.controller';
import { TripController } from './presentation/controllers/trip.controller';
import { DriverController } from './presentation/controllers/driver.controller';
import { ProfileController } from './presentation/controllers/profile.controller';
import { DriverOrmEntity } from './infrastructure/persistence/postgres/entities/driver.orm-entity';
import { TripOrmEntity } from './infrastructure/persistence/postgres/entities/trip.orm-entity';
import { ProfileOrmEntity } from './infrastructure/persistence/postgres/entities/profile.orm-entity';
import { TypeOrmDriverRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-driver.repository';
import { TypeOrmTripRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-trip.repository';
import { TypeOrmProfileRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-profile.repository';
import { RequestTripUseCase } from './application/use-cases/request-trip.use-case';
import { AssignDriverUseCase } from './application/use-cases/assign-driver.use-case';
import { NearestDriverStrategy } from './application/strategies/nearest-driver.strategy';
import { RegisterDriverUseCase } from './application/use-cases/register-driver.use-case';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';

@Module({
  imports: [
    // 1. Cargar variables de entorno (.env) globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Conectar a Base de Datos
    DatabaseModule, 
    TypeOrmModule.forFeature([UserOrmEntity, DriverOrmEntity, TripOrmEntity, ProfileOrmEntity]),
  ],
  controllers: [UserController, TripController, DriverController, ProfileController],
  providers: [
    RegisterUserUseCase,
    ListUsersUseCase,
    RegisterDriverUseCase,
    RequestTripUseCase,
    AssignDriverUseCase,
    CreateProfileUseCase,
    GetProfileUseCase,
    NearestDriverStrategy,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IDriverRepository',
      useClass: TypeOrmDriverRepository,
    },
    {
      provide: 'ITripRepository',
      useClass: TypeOrmTripRepository,
    },
    {
      provide: 'IProfileRepository',
      useClass: TypeOrmProfileRepository,
    },
    {
      provide: 'DriverAssignmentStrategy',
      useClass: NearestDriverStrategy,
    },
  ],
})
export class AppModule {}