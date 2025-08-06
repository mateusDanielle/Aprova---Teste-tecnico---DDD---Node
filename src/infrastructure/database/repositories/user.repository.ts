import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Name, UserCategoryVO } from '../../../domain';
import type { IUserRepository } from '../../../domain';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name.getValue(),
        city: user.city,
        category: user.category.getValue(),
      },
    });

    return new User({
      id: createdUser.id,
      name: Name.create(createdUser.name),
      city: createdUser.city,
      category: UserCategoryVO.create(createdUser.category),
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      name: Name.create(user.name),
      city: user.city,
      category: UserCategoryVO.create(user.category),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(
      (user) =>
        new User({
          id: user.id,
          name: Name.create(user.name),
          city: user.city,
          category: UserCategoryVO.create(user.category),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name.getValue(),
        city: user.city,
        category: user.category.getValue(),
      },
    });

    return new User({
      id: updatedUser.id,
      name: Name.create(updatedUser.name),
      city: updatedUser.city,
      category: UserCategoryVO.create(updatedUser.category),
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
