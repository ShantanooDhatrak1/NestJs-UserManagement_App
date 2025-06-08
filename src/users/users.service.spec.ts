import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUserArray = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { id: 2, username: 'user', password: bcrypt.hashSync('user123', 10), role: 'user' },
  ];

  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 3, ...user })),
    find: jest.fn().mockResolvedValue(mockUserArray),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      Promise.resolve(mockUserArray.find(u => u.id === id))
    ),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      Promise.resolve(mockUserArray.find(u => u.id === id))
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockUserArray);
  });

  it('should find a user by ID', async () => {
    const result = await service.findById(1) as User;
    expect(result.username).toBe('admin');

  });

  it('should return undefined if user not found by ID', async () => {
    const result = await service.findById(999);
    expect(result).toBeUndefined();
  });

  // it('should create a new user', async () => {
  //   const userDto = { username: 'new', password: 'hashed', role: 'user' };
  //   const result = await service.createUser(userDto);
  //   expect(result.id).toBeDefined();
  //   expect(result.username).toBe('new');
  // });

  it('should update a user role', async () => {
    mockRepo.findOneBy = jest.fn().mockResolvedValue({ id: 1, role: 'user', username: 'admin' });
    mockRepo.save = jest.fn().mockImplementation(user => Promise.resolve(user));

    const result = await service.updateUserRole(1, 'editor');
    expect(result.role).toBe('editor');
  });

  it('should throw error if user not found when updating role', async () => {
    mockRepo.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.updateUserRole(100, 'editor')).rejects.toThrow('User not found');
  });
});
