import { IsNumber, IsString } from 'class-validator';

export class ExDTO {
  @IsString()
  critere: string;

  @IsNumber()
  age: number;

  constructor(critere: string, age: number) {
    this.critere = critere;
    this.age = age;
  }
}
