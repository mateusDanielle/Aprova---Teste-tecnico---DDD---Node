export class BookYear {
  private constructor(private readonly value: number) {}

  static create(year: number): BookYear {
    const currentYear = new Date().getFullYear();

    if (year < 1000) {
      throw new Error('Year must be at least 1000');
    }

    if (year > currentYear + 1) {
      throw new Error(`Year cannot be greater than ${currentYear + 1}`);
    }

    return new BookYear(year);
  }

  getValue(): number {
    return this.value;
  }

  isClassic(): boolean {
    return this.value < 1950;
  }

  isModern(): boolean {
    return this.value >= 1950;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: BookYear): boolean {
    return this.value === other.value;
  }
}
