// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../infrastructure/persistence/postgres/database.module';
import { UserOrmEntity } from '../infrastructure/persistence/postgres/entities/user.orm-entity';
import { UserController } from '../presentation/controllers/user.controller';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { TypeOrmUserRepository } from '../infrastructure/persistence/postgres/entities/repositories/typeorm-user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, // Carga la conexión global (host, user, pass)
    TypeOrmModule.forFeature([UserOrmEntity]), // Habilita el repositorio específico para este módulo
  ],
  controllers: [UserController],
  providers: [
    RegisterUserUseCase,
    {
      provide: 'IUserRepository', // Token que pide el Caso de Uso
      useClass: TypeOrmUserRepository, // Clase real que se inyecta
    },
  ],
})
export class AppModule {}