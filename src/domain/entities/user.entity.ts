import { Name, UserCategoryVO } from '../value-objects';

export interface UserProps {
  id?: string;
  name: Name;
  city: string;
  category: UserCategoryVO;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly name: Name;
  public readonly city: string;
  public readonly category: UserCategoryVO;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.city = props.city;
    this.category = props.category;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): User {
    return new User(props);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name.getValue(),
      city: this.city,
      category: this.category.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
