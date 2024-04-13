import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Skill } from 'src/skills/entities/skill.entity';

export class CreateCvDto {
  @IsString()
  name: string;
  @IsString()
  firstname: string;
  @IsNumber()
  age: number;
  @IsNumber()
  cin: number;
  @IsString()
  job: string;
  @IsString()
  path: string;
  @IsOptional()
  skills: Skill[];
  constructor(
    name: string,
    firstname: string,
    age: number,
    path: string,
    cin: number,
    job: string,
  ) {
    this.name = name;
    this.firstname = firstname;
    this.age = age;
    this.cin = cin;
    this.job = job;
    this.path = path;
    this.skills = [];
  }
}
