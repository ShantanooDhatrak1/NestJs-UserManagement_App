import { IsString, IsIn } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsIn(['admin', 'user'], { message: 'Role must be either admin or user' })
  role: 'admin' | 'user';
}
