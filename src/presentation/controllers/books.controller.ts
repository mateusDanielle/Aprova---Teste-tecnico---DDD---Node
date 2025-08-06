import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Inject,
} from '@nestjs/common';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { SearchBooksUseCase } from '../../application/use-cases/search-books.use-case';
import { CreateBookDto } from '../../application/dto/create-book.dto';
import { BookResponseDto } from '../../application/dto/book-response.dto';
import { ApiCreateResponse, ApiSearchResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';
import type { IBookRepository } from '../../domain';

@Controller('books')
@ValidateEntity()
export class BooksController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly searchBooksUseCase: SearchBooksUseCase,
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  @Post()
  @ApiCreateResponse(BookResponseDto)
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.createBookUseCase.execute(createBookDto);
  }

  @Get('search')
  @ApiSearchResponse(BookResponseDto)
  async searchBooks(@Query('q') searchTerm: string) {
    return this.searchBooksUseCase.execute(searchTerm);
  }

  @Get()
  async findAll() {
    const books = await this.bookRepository.findAll();
    return books.map((book) => ({
      id: book.id,
      name: book.name,
      year: book.year.getValue(),
      publisher: book.publisher,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return {
      id: book.id,
      name: book.name,
      year: book.year.getValue(),
      publisher: book.publisher,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }
}
