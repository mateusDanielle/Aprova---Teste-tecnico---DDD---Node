import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { SearchBooksUseCase } from '../../application/use-cases/search-books.use-case';
import { CreateBookDto } from '../../application/dto/create-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly searchBooksUseCase: SearchBooksUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar livro',
    description: 'Cria um novo livro na biblioteca',
  })
  @ApiResponse({
    status: 201,
    description: 'Livro criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'clx1234567890abcdef',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(@Body() createBookDto: CreateBookDto): Promise<{ id: string }> {
    return this.createBookUseCase.execute(createBookDto);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pesquisar livros',
    description: 'Busca livros por nome',
  })
  @ApiQuery({
    name: 'q',
    description: 'Termo de busca',
    example: 'Senhor dos Anéis',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de livros encontrados',
    schema: {
      type: 'object',
      properties: {
        books: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234567890abcdef' },
              name: { type: 'string', example: 'O Senhor dos Anéis' },
              year: { type: 'number', example: 1954 },
              publisher: { type: 'string', example: 'Editora Martins Fontes' },
              createdAt: {
                type: 'string',
                example: '2024-01-15T10:30:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-15T10:30:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  async search(@Query('q') searchTerm: string): Promise<{ books: any[] }> {
    return this.searchBooksUseCase.execute(searchTerm);
  }
}
