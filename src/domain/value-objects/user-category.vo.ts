export enum UserCategory {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  LIBRARIAN = 'LIBRARIAN',
}

export class UserCategoryVO {
  private constructor(private readonly value: UserCategory) {}

  static create(category: string): UserCategoryVO {
    if (!Object.values(UserCategory).includes(category as UserCategory)) {
      throw new Error(`Invalid user category: ${category}`);
    }
    return new UserCategoryVO(category as UserCategory);
  }

  getValue(): UserCategory {
    return this.value;
  }

  getLoanPeriodDays(): number {
    switch (this.value) {
      case UserCategory.STUDENT:
        return 10;
      case UserCategory.TEACHER:
        return 30;
      case UserCategory.LIBRARIAN:
        return 60;
      default:
        throw new Error('Invalid category');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserCategoryVO): boolean {
    return this.value === other.value;
  }
}
