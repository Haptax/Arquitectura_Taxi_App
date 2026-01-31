import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/persistence/postgres/entities/repositories/database.module';
// Aquí importaremos luego los controladores
// import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [
    // 1. Cargar variables de entorno (.env) globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Conectar a Base de Datos
    DatabaseModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}