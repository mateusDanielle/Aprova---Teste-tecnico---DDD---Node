export interface BookProps {
  id?: string;
  name: string;
  year: number;
  publisher: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Book {
  public readonly id: string;
  public readonly name: string;
  public readonly year: number;
  public readonly publisher: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: BookProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.year = props.year;
    this.publisher = props.publisher;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(
    props: Omit<BookProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Book {
    return new Book(props);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      publisher: this.publisher,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
