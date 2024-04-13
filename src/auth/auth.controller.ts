import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDTO } from './dto/loginDTO';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
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
  @AuthGuard(JwtAuthGuard)
  getMe() {
    return 'Hello';
  }
}
