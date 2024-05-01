import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from '../cvs/entities/cv.entity';
@Injectable()
export class CvOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cvId = request.params.id;
    const { user } = request;
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['user'],
    });

    // console.log('cv', cv);
    // console.log('user', user);

    if (!cv) throw new NotFoundException();
    const isOwner = cv.user.id === user.userId;
    // console.log('isOwner', isOwner);
    if (!isOwner) throw new UnauthorizedException();

    return isOwner;
  }
}
