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

  private users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { id: 2, username: 'user', password: bcrypt.hashSync('user123', 10), role: 'user' },
  ];

  async findByUsername(username: string) {
    return this.users.find(user => user.username === username);
    // For actual DB usage: return this.userRepo.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.users.find(user => user.id === id);
    // For actual DB usage: return this.userRepo.findOne({ where: { id } });
  }

  async createUser(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
