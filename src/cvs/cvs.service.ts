import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { ExDTO } from './dto/ex.dto';

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from '../users/entities/user.entity';
import { PayloadType } from '../auth/types';

import * as fs from 'fs-extra';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CvsService {
  //constructor
  constructor(
    @InjectRepository(Cv)
    private cvRepo: Repository<Cv>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async add(cv: CreateCvDto) {
    return await this.cvRepo.save(cv);
  }

  async findall(): Promise<Cv[]> {
    return await this.cvRepo.find();
  }

  async getAll(
    dto: ExDTO,
    options: IPaginationOptions,
    user: PayloadType,
  ): Promise<Pagination<Cv>> {
    console.log('user', user);
    const queryBuilder = this.cvRepo.createQueryBuilder('cv');
    if (user.role === 'admin') {
      queryBuilder.where(
        'cv.age = :age OR cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere',
        {
          age: dto.age,
          critere: `%${dto.critere}%`,
        },
      );
    } else {
      queryBuilder.where(
        '(cv.age = :age OR cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere) AND cv.user.id = :userId',
        {
          age: dto.age,
          critere: `%${dto.critere}%`,
          userId: user.userId,
        },
      );
    }
    return paginate<Cv>(queryBuilder, options);
  }

  async addCv(cv: CreateCvDto, userId: number): Promise<Cv> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'role'],
    });
    const cv1 = new Cv();
    cv1.name = cv.name;
    cv1.firstname = cv.firstname;
    cv1.age = cv.age;
    cv1.cin = cv.cin;
    cv1.job = cv.job;
    cv1.path = cv.path;
    cv1.user = user;
    return await this.cvRepo.save(cv1);
  }

  async findCvById(id: number): Promise<Cv> {
    const cv = await this.cvRepo.findOneById(id);
    if (!cv) {
      throw new NotFoundException('aucun cv porte cet id');
    }
    return cv;
  }

  async updateCv(id: number, cv: UpdateCvDto, userId: number): Promise<Cv> {
    //On récupère le cv d'id id et ensuite on replace les anciennes valeurs de ce cv par ceux du cv passé en paramètre
    const newCv = await this.cvRepo.findOne({
      where:{id:id}
    });
    // tester le cas ou le cv d'id id n'existe pas
    if (!newCv) {
      throw new NotFoundException(`Le Cv d'id ${id} n'existe pas`);
    }
    console.log(newCv, userId);
    if (newCv.user.id !== userId) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à modifier ce Cv",
      );
    }
    // on sauvgarde la nouvelle entité donc le nouveau cv
    await this.cvRepo.update(id, cv);
    return newCv;
  }

  async delete(id: number) {
    const cv = await this.cvRepo.findOneById(id);
    this.cvRepo.delete(id);
    return cv;
  }

  async uploadFile(id: number, file) {
    const foundCv = await this.findCvById(id);

    if (!foundCv) throw new NotFoundException('Cv not found');

    const fileName = Date.now() + file.originalname;
    const filePath = join(process.cwd(), 'public/uploads', fileName);

    try {
      await fs.writeFile(filePath, file.buffer);
      foundCv.path = `/public/uploads/${fileName}`;

      await this.cvRepo.save(foundCv);
      return foundCv;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getLogs(user: PayloadType) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    if (user.role === 'admin') {
      // Fetch all logs
      
      const res = await fetch('https://localhost:9200/cvs/_search?q=*', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA==',
        },
      })
      const data = await res.json();
      console.log(data.hits.hits);
      return data.hits.hits;
      
    } else {
      // Fetch logs for a specific user
      const res = await fetch(`https://localhost:9200/cvs/_search?q=userId:${user.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA==',
        },
      })
      const data = await res.json();
      console.log(data.hits.hits);
      return data.hits.hits;
    }

  }
  
}
