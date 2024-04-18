import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import {
  randDirectoryPath,
  randEmail,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
  randPassword,
  randSkill,
  randUserName,
} from '@ngneat/falso';
import { UsersService } from '../users/users.service';
import { CvsService } from '../cvs/cvs.service';
import { SkillsService } from '../skills/skills.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

const NUMBER_OF_USERS = 9;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService: UsersService = app.get(UsersService);
  const cvService: CvsService = app.get(CvsService);
  const skillService: SkillsService = app.get(SkillsService);
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const email = randEmail();
    const username = randUserName();
    const password = randPassword();
    const user = new CreateUserDto(username, email, password);

    await userService.create(user);

    const skill = {
      designation: randSkill(),
    };
    await skillService.add(skill);
  }
  const users = userService.findall();
  for (const user of await users) {
    const cv = {
      name: randLastName(),
      firstname: randFirstName(),
      age: randNumber({ min: 16, max: 60 }),
      cin: randNumber({ min: 1400000, max: 16000000 }),
      job: randJobTitle(),
      path: randDirectoryPath(),
      user: user,
      skills: [],
    };
    await cvService.add(cv);
  }
  const cvs = await cvService.findall();
  for (const cv of cvs) {
    const index = Math.floor(Math.random() * NUMBER_OF_USERS) + 1;
    console.log('index =', index);
    const skill = await skillService.getSkillById(index);
    console.log('skill', skill);
    console.log(cv);
    console.log('cv skills', cv.skills);
    cv.skills.push(skill);
    await cvService.add(cv);
  }
}

bootstrap();
