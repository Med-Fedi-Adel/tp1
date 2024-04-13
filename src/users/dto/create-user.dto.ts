import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  constructor(u: string, e: string, p: string) {
    this.username = u;
    this.email = e;
    this.password = p;
  }
}
