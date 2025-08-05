import { Book } from '../entities/book.entity';

export interface IBookRepository {
  create(book: Book): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  findAll(): Promise<Book[]>;
  searchByName(name: string): Promise<Book[]>;
  update(book: Book): Promise<Book>;
  delete(id: string): Promise<void>;
}
