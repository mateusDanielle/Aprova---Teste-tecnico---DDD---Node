import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Library Management System API')
    .setDescription(
      'API para gerenciamento de empréstimos de livros em biblioteca',
    )
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas aos usuários')
    .addTag('books', 'Operações relacionadas aos livros')
    .addTag('loans', 'Operações relacionadas aos empréstimos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Library Management API',
  });
};
