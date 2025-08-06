import { Injectable, Inject } from '@nestjs/common';
import type { IBookRepository } from '../../domain';
import { BookResponseDto } from '../dto/book-response.dto';

@Injectable()
export class SearchBooksUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(searchTerm: string): Promise<{ books: BookResponseDto[] }> {
    const books = await this.bookRepository.searchByName(searchTerm);

    const bookResponses: BookResponseDto[] = books.map((book) => ({
      id: book.id,
      name: book.name,
      year: book.year.getValue(),
      publisher: book.publisher,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));

    return { books: bookResponses };
  }
}
