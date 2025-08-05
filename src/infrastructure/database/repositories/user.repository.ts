import { Injectable } from '@nestjs/common';
import { User, UserCategory } from '../../../domain';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        city: user.city,
        category: user.category,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return new User({
      id: createdUser.id,
      name: createdUser.name,
      city: createdUser.city,
      category: createdUser.category as UserCategory,
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
      name: user.name,
      city: user.city,
      category: user.category as UserCategory,
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
          name: user.name,
          city: user.city,
          category: user.category as UserCategory,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        city: user.city,
        category: user.category,
        updatedAt: new Date(),
      },
    });

    return new User({
      id: updatedUser.id,
      name: updatedUser.name,
      city: updatedUser.city,
      category: updatedUser.category as UserCategory,
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
