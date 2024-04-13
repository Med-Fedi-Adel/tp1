import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  role: string;
  constructor(u: string, e: string, p: string, r: string = 'user') {
    this.username = u;
    this.email = e;
    this.password = p;
    this.role = r;
  }
}
