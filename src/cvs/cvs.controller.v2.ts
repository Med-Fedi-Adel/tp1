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
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { ExDTO } from './dto/ex.dto';

import { verify } from 'jsonwebtoken';
import { Cv } from './entities/cv.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/jwt-guard';
import { GetUser } from '../auth/getUser.decorator';
import { PayloadType } from '../auth/types';

@Controller('cvs')
export class CvsController {
  constructor(private service: CvsService) {}
  // @Get()
  // async addCvAvecDonnéesFictives() {
  // return await this.service.GenererDonnéesFictives();
  // }
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
    return await this.service.addCv(addcv, user.userId);
  }

  @Get(':id')
  async cvById(@Param('id', ParseIntPipe) id) {
    return await this.service.findCvById(id);
  }
  // eslint-disable-next-line prettier/prettier
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCv(
    @Param('id', ParseIntPipe) id,
    @Body() updatecv: UpdateCvDto,
    @GetUser() user: PayloadType,
  ) {
    try {
      return await this.service.updateCv(id, updatecv, user.userId);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('You cannot access this route');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id) {
    return await this.service.delete(id);
  }
}
