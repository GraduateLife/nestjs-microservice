import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
