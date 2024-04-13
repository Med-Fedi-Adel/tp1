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
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { ExDTO } from './dto/ex.dto';

@Controller('v1_cvs')
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
  ) {
    const dto = new ExDTO(critere, age);
    return await this.service.getAll(dto);
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
  /* @Patch(':id')
  async updateCv(@Param('id', ParseIntPipe) id, @Body() updatecv: UpdateCvDto) {
    return await this.service.updateCv(id, updatecv);
  }*/
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id) {
    return await this.service.delete(id);
  }
}
