import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { SearchBooksUseCase } from '../../application/use-cases/search-books.use-case';
import { CreateBookDto } from '../../application/dto/create-book.dto';
import { BookResponseDto } from '../../application/dto/book-response.dto';
import { ApiCreateResponse, ApiSearchResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';

@Controller('books')
@ValidateEntity()
export class BooksController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly searchBooksUseCase: SearchBooksUseCase,
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
}
