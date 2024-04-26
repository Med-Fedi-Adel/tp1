import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDTO } from './dto/loginDTO';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ): Promise<{ accessToken: string }> {
    console.log('loginDTO', loginDTO);
    return this.authService.login(loginDTO);
  }

  @Post('signup')
  signup(
    @Body()
    userDTO: CreateUserDto,
  ): Promise<User> {
    if (!userDTO.role) userDTO.role = 'user';
    return this.usersService.create(userDTO);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe() {
    return 'Hello';
  }
}
