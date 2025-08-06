export class Name {
  private constructor(private readonly value: string) {}

  static create(name: string): Name {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (trimmed.length > 100) {
      throw new Error('Name must be less than 100 characters');
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      throw new Error('Name contains invalid characters');
    }

    return new Name(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  getFullName(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Name): boolean {
    return this.value === other.value;
  }
}
