import { IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  designation: string;
  constructor(d: string) {
    this.designation = d;
  }
}
