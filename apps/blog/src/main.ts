import { NestFactory } from '@nestjs/core';
import { BlogModule } from './blog.module';
import { CommonExceptionFilter } from '@app/common/globals/filter';
import { CommonInterceptor } from '@app/common/globals/interceptor';
import { CommonSetRequestAtMiddleware } from '@app/common/globals/middleware';

async function bootstrap() {
  const app = await NestFactory.create(BlogModule);
  app.useGlobalInterceptors(new CommonInterceptor());
  app.useGlobalFilters(new CommonExceptionFilter());
  // app.useGlobalPipes(new RestfulValidationPipe(false));
  app.use(CommonSetRequestAtMiddleware);

  await app.listen(3010);
}
bootstrap();
