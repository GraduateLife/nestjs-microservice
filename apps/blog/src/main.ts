import { NestFactory } from '@nestjs/core';
import { BlogModule } from './blog.module';
import { CommonExceptionFilter } from '@app/common/globals/filter';
import { CommonTimeoutInterceptor } from '@app/common/globals/interceptor';
import { CommonSetRequestAtMiddleware } from '@app/common/globals/middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BlogModule);
  app.useGlobalInterceptors(new CommonTimeoutInterceptor());
  app.useGlobalFilters(new CommonExceptionFilter());
  // app.useGlobalPipes(new RestfulValidationPipe(false));
  app.use(CommonSetRequestAtMiddleware);

  const config = new DocumentBuilder()
    .setTitle('blog example')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });

  await app.listen(3010);
}
bootstrap();
