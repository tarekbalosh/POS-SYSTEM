import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors();

  // Validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Global Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('ProPOS API')
    .setDescription('The Restaurant POS SaaS API Documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('menu')
    .addTag('orders')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/docs`);
  } else {
    await app.init();
  }
  
  return app;
}

// Support for local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

