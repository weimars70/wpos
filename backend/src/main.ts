import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Serve Quasar SPA frontend (dist/spa) from the root
  const frontendPath = join(process.cwd(), '..', 'frontend', 'dist', 'spa');
  app.useStaticAssets(frontendPath, { prefix: '/' });

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3037;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
}
bootstrap();
