import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const isSsl = configService.get<string>('DB_SSL') === 'true' || Boolean(databaseUrl && databaseUrl.includes('sslmode=require'));
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/entities/*.orm-entity{.ts,.js}'],
            synchronize: true, // Para prototipo y portafolio asegura que las tablas existan
            autoLoadEntities: true,
            ssl: isSsl ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || '1423miki',
          database: configService.get<string>('DB_NAME') || 'taxi_db',
          entities: [__dirname + '/entities/*.orm-entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
          ssl: isSsl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}