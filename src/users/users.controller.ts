import { Controller, Get, UseGuards, Request, Patch, Param, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';


@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  @Get()
  @Roles('admin') // Only admin can access
  getUsers(@Request() req) {
    console.log("Inside getUsers")
    return ['User1', 'User2'];
  }

  @Get('profile')
  @Roles('user', 'admin') // Any logged-in user can access
  getProfile(@Request() req) {
    return req.user;
  }
}
