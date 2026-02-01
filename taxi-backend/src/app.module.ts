import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './infrastructure/persistence/postgres/database.module';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { TypeOrmUserRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/postgres/entities/user.orm-entity';
import { UserController } from './presentation/controllers/user.controller';
import { TripController } from './presentation/controllers/trip.controller';
import { DriverController } from './presentation/controllers/driver.controller';
import { ProfileController } from './presentation/controllers/profile.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { DriverOrmEntity } from './infrastructure/persistence/postgres/entities/driver.orm-entity';
import { TripOrmEntity } from './infrastructure/persistence/postgres/entities/trip.orm-entity';
import { ProfileOrmEntity } from './infrastructure/persistence/postgres/entities/profile.orm-entity';
import { TypeOrmDriverRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-driver.repository';
import { TypeOrmTripRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-trip.repository';
import { TypeOrmProfileRepository } from './infrastructure/persistence/postgres/entities/repositories/typeorm-profile.repository';
import { RequestTripUseCase } from './application/use-cases/request-trip.use-case';
import { NearestDriverStrategy } from './application/strategies/nearest-driver.strategy';
import { RegisterDriverUseCase } from './application/use-cases/register-driver.use-case';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user.use-case';
import { AuthService } from './infrastructure/auth/auth.service';
import { JwtTokenService } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RegisterAdminUseCase } from './application/use-cases/register-admin.use-case';
import { ChangeUserRoleUseCase } from './application/use-cases/change-user-role.use-case';
import { ListDriversUseCase } from './application/use-cases/list-drivers.use-case';
import { ListTripsUseCase } from './application/use-cases/list-trips.use-case';
import { AcceptTripUseCase } from './application/use-cases/accept-trip.use-case';
import { CompleteTripUseCase } from './application/use-cases/complete-trip.use-case';
import { UpdateDriverLocationUseCase } from './application/use-cases/update-driver-location.use-case';

@Module({
  imports: [
    // 1. Cargar variables de entorno (.env) globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // 2. Conectar a Base de Datos
    DatabaseModule, 
    TypeOrmModule.forFeature([UserOrmEntity, DriverOrmEntity, TripOrmEntity, ProfileOrmEntity]),
  ],
  controllers: [UserController, TripController, DriverController, ProfileController, AuthController],
  providers: [
    RegisterUserUseCase,
    ListUsersUseCase,
    RegisterAdminUseCase,
    ChangeUserRoleUseCase,
    RegisterDriverUseCase,
    ListDriversUseCase,
    UpdateDriverLocationUseCase,
    RequestTripUseCase,
    ListTripsUseCase,
    AcceptTripUseCase,
    CompleteTripUseCase,
    CreateProfileUseCase,
    GetProfileUseCase,
    AuthenticateUserUseCase,
    NearestDriverStrategy,
    JwtAuthGuard,
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
    {
      provide: 'IPasswordHasher',
      useClass: AuthService,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
})
export class AppModule {}