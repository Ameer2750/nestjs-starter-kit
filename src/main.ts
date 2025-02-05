import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomResponseObjectInterceptor } from 'src/common/interceptors/custom-response-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //enable cors
  app.enableCors({origin: true});

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe({
      // This will automatically strip unneeded fields
      whitelist: true,   // Automatically remove properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true,   // Automatically transform payloads to DTO instances
  }))


  // set global prefix
  app.setGlobalPrefix('api');

  // app global interceptor for tranforming response
  app.useGlobalInterceptors(new CustomResponseObjectInterceptor())

  await app.listen(8068);
  console.log('server is running on PORT 8068')
}
bootstrap();
