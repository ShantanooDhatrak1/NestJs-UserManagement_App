import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Use database to find user by username
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  // ✅ Use database to find user by ID
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  // ✅ Save a new user to the database
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  // ✅ Return all users (admin use-case)
  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'username', 'role'], // avoid exposing password
    });
  }

  // ✅ Update a user’s role by ID
  async updateUserRole(id: number, role: 'admin' | 'user' | 'editor'): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');

    user.role = role;
    return this.userRepo.save(user);
  }
}
