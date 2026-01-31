import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    credentials: false,
  });
  
  // Activa la validación de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Obtenemos el puerto de las variables de entorno o usamos el 3000 por defecto
  const port = process.env.PORT || 3000;
  
  // LLAMAR A LISTEN SOLO UNA VEZ
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();