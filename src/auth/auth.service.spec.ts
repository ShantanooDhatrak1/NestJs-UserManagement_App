import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';


describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    validateUser: jest.fn(),
    findByUsername: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return a token on valid login', async () => {
    const result = await service.login({ username: 'testuser', password: 'pass' });
    expect(result).toHaveProperty('access_token');
  });

  it('should throw error if user exists during registration', async () => {
    mockUsersService.findByUsername.mockResolvedValue({ id: 1, username: 'test' });

    await expect(
      service.register({ username: 'test', password: '123', role: 'user' }),
    ).rejects.toThrow('Username already exists');
  });
});
