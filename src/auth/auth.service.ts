import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/loginDTO';
import * as bcrypt from 'bcryptjs';
import { PayloadType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(loginDTO);

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;
      //return user;

      const payload: PayloadType = {
        email: user.email,
        userId: user.id,
        username: user.username,
        role: user.role,
      };
      console.log(user);
      return { accessToken: this.jwtService.sign(payload) };
    } else throw new UnauthorizedException('Password does not match');
  }
}
