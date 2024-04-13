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

@Injectable()
export class CvsService {
  constructor(
    @InjectRepository(Cv)
    private cvRepo: Repository<Cv>,
  ) {}

  async add(cv: CreateCvDto) {
    return await this.cvRepo.save(cv);
  }
  async findall(): Promise<Cv[]> {
    return await this.cvRepo.find();
  }
  async getAll(dto: ExDTO): Promise<Cv[]> {
    return await this.cvRepo
      .createQueryBuilder('cv')
      .where(
        'cv.age = :age OR cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere',
        {
          age: dto.age,
          critere: `%${dto.critere}%`,
        },
      )
      .getMany();
  }
  async addCv(cv: CreateCvDto): Promise<Cv> {
    return await this.cvRepo.save(cv);
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
