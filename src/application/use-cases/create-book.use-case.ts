import { Injectable, Inject } from '@nestjs/common';
import type { IBookRepository } from '../../domain';
import { Book, BookYear } from '../../domain';
import { CreateBookDto } from '../dto/create-book.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(createBookDto: CreateBookDto): Promise<{ id: string }> {
    const year = BookYear.create(createBookDto.year);

    const book = Book.create({
      name: createBookDto.name,
      year,
      publisher: createBookDto.publisher,
    });

    const createdBook = await this.bookRepository.create(book);

    return { id: createdBook.id };
  }
}
