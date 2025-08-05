import { Injectable } from '@nestjs/common';
import { Book } from '../../../domain';
import { IBookRepository } from '../../../domain/repositories/book.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(book: Book): Promise<Book> {
    const createdBook = await this.prisma.book.create({
      data: {
        id: book.id,
        name: book.name,
        year: book.year,
        publisher: book.publisher,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });

    return new Book({
      id: createdBook.id,
      name: createdBook.name,
      year: createdBook.year,
      publisher: createdBook.publisher,
      createdAt: createdBook.createdAt,
      updatedAt: createdBook.updatedAt,
    });
  }

  async findById(id: string): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return null;
    }

    return new Book({
      id: book.id,
      name: book.name,
      year: book.year,
      publisher: book.publisher,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  }

  async findAll(): Promise<Book[]> {
    const books = await this.prisma.book.findMany();

    return books.map(
      (book) =>
        new Book({
          id: book.id,
          name: book.name,
          year: book.year,
          publisher: book.publisher,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        }),
    );
  }

  async searchByName(name: string): Promise<Book[]> {
    const books = await this.prisma.book.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return books.map(
      (book) =>
        new Book({
          id: book.id,
          name: book.name,
          year: book.year,
          publisher: book.publisher,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        }),
    );
  }

  async update(book: Book): Promise<Book> {
    const updatedBook = await this.prisma.book.update({
      where: { id: book.id },
      data: {
        name: book.name,
        year: book.year,
        publisher: book.publisher,
        updatedAt: new Date(),
      },
    });

    return new Book({
      id: updatedBook.id,
      name: updatedBook.name,
      year: updatedBook.year,
      publisher: updatedBook.publisher,
      createdAt: updatedBook.createdAt,
      updatedAt: updatedBook.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({
      where: { id },
    });
  }
}
