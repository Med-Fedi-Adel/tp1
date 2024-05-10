import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
  Headers,
  UnauthorizedException,
  DefaultValuePipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { ExDTO } from './dto/ex.dto';

import { Cv } from './entities/cv.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/jwt-guard';
import { GetUser } from '../auth/getUser.decorator';
import { PayloadType } from '../auth/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvOwnerGuard } from '../auth/cv-owner-guard';
import { Observable, fromEvent, map, merge } from 'rxjs';
import { EVENTS } from 'src/listener/Events/cv.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('cvs')
export class CvsController {
  constructor(private service: CvsService,private eventEmitter: EventEmitter2) {}
  // @Get()
  // async addCvAvecDonnéesFictives() {
  // return await this.service.GenererDonnéesFictives();
  // }
  @UseGuards(JwtAuthGuard)
  @Sse('sse')
  sse(@GetUser() user: PayloadType): Observable<MessageEvent> {

    const cvAdd$ = fromEvent(this.eventEmitter, EVENTS.CV_ADD);
  const cvDelete$ = fromEvent(this.eventEmitter, EVENTS.CV_DELETE);
  const cvUpdate$ = fromEvent(this.eventEmitter, EVENTS.CV_UPDATE);
    
  return merge(cvAdd$, cvDelete$, cvUpdate$).pipe(
      map((payload) => {
        if (user.role === 'admin'){
          return ({ data : {payload} });
        }
        else if (user.role === 'user'){
          if (payload['userId'] === user.userId){
            return ({ data : {payload} });
          }
        }
        
        
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('logs')
  getLogs(@GetUser() user: PayloadType){
    return this.service.getLogs(user);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  async getALLCvs(
    @Query('critere')
    critere: string,
    @Query('age', ParseIntPipe)
    age: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @GetUser() user: PayloadType,
  ): Promise<Pagination<Cv>> {
    limit = limit > 100 ? 100 : limit;
    const dto = new ExDTO(critere, age);
    return await this.service.getAll(dto, { limit, page }, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addCv(@Body() addcv: CreateCvDto, @GetUser() user: PayloadType) {
    console.log('user', user);
    this.eventEmitter.emit(EVENTS.CV_ADD, {date: new Date(), userId: user.userId,cv:addcv});
    return await this.service.addCv(addcv, user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async cvById(@Param('id', ParseIntPipe) id) {
    return await this.service.findCvById(id);
  }
  // eslint-disable-next-line prettier/prettier
  @UseGuards(JwtAuthGuard, CvOwnerGuard)
  @Put(':id')
  async updateCv(
    @Param('id', ParseIntPipe) id,
    @Body() updatecv: UpdateCvDto,
    @GetUser() user: PayloadType,
  ) {
    try {
      const cv= await this.service.updateCv(id, updatecv, user.userId);
      this.eventEmitter.emit(EVENTS.CV_UPDATE, {date: new Date(), userId: user.userId,cv:cv});
      return cv;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('You cannot access this route');
    }
  }
  @UseGuards(JwtAuthGuard, CvOwnerGuard)
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id,@GetUser() user: PayloadType){
    const cv = await this.service.delete(id);
    this.eventEmitter.emit(EVENTS.CV_DELETE, {date: new Date(), userId: user.userId,cv:cv});
    return cv;
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log('id', id);
    return await this.service.uploadFile(id, file);
  }

  

  


  
}
