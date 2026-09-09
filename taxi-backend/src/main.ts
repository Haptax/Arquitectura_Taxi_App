import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o curl) o cualquier dominio en desarrollo/producción
      if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || origin.includes('netlify.app') || origin.includes('onrender.com')) {
        callback(null, true);
      } else {
        callback(null, true); // Permite acceso para testing en portafolio
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
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