import { applyDecorators, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

export const ValidateEntity = () => {
  return applyDecorators(
    UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: 422,
      }),
    ),
  );
};
