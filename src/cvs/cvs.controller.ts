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
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { ExDTO } from './dto/ex.dto';

import { verify } from 'jsonwebtoken';
import { Cv } from './entities/cv.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('cvs')
export class CvsController {
  constructor(private service: CvsService) {}
  //@Get()
  //async addCvAvecDonnéesFictives() {
  //return await this.service.GenererDonnéesFictives();
  //}
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
  ): Promise<Pagination<Cv>> {
    limit = limit > 100 ? 100 : limit;
    const dto = new ExDTO(critere, age);
    return await this.service.getAll(dto, { limit, page });
  }
  @Post()
  async addCv(@Body() addcv: CreateCvDto) {
    return await this.service.addCv(addcv);
  }
  @Get('byid/:id')
  async cvById(@Param('id', ParseIntPipe) id) {
    return await this.service.findCvById(id);
  }
  // eslint-disable-next-line prettier/prettier
  @Put(':id')
  async updateCv(
    @Headers('auth-user') token: string,
    @Param('id', ParseIntPipe) id,
    @Body() updatecv: UpdateCvDto,
  ) {
    try {
      const payLoad = verify(token, 'secret');
      return await this.service.updateCv(id, updatecv, payLoad['userId']);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('You cannot access this route');
    }
  }
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id) {
    return await this.service.delete(id);
  }
}
