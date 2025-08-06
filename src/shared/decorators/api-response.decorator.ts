import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiCreateResponse = (responseType: any) => {
  return applyDecorators(
    ApiOperation({ summary: 'Create resource' }),
    ApiResponse({
      status: 201,
      description: 'Resource created successfully',
      type: responseType,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
    }),
  );
};

export const ApiGetResponse = (responseType: any) => {
  return applyDecorators(
    ApiOperation({ summary: 'Get resource' }),
    ApiResponse({
      status: 200,
      description: 'Resource retrieved successfully',
      type: responseType,
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
    }),
  );
};

export const ApiSearchResponse = (responseType: any) => {
  return applyDecorators(
    ApiOperation({ summary: 'Search resources' }),
    ApiResponse({
      status: 200,
      description: 'Resources found',
      type: responseType,
    }),
  );
};

export const ApiLoanResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create loan' }),
    ApiResponse({
      status: 201,
      description: 'Loan created successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid loan data or business rule violation',
    }),
    ApiResponse({
      status: 404,
      description: 'User or book not found',
    }),
  );
};
