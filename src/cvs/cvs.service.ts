import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { ExDTO } from './dto/ex.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/users/entities/user.entity';
import { PayloadType } from 'src/auth/types';

@Injectable()
export class CvsService {
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
  async updateCv(
    id: number,
    cv: UpdateCvDto,
    userId: number,
  ): Promise<UpdateResult> {
    //On récupère le cv d'id id et ensuite on replace les anciennes valeurs de ce cv par ceux du cv passé en paramètre
    const newCv = await this.cvRepo.findOneBy({ id });
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
    return await this.cvRepo.update(id, cv);
  }
  async delete(id: number) {
    return this.cvRepo.delete(id);
  }
}
