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
  BadRequestException,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { ExDTO } from './dto/ex.dto';

import { verify } from 'jsonwebtoken';

import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';

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
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file) {

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname) {
      throw new BadRequestException('Invalid file object');
    }
    
    if (file.size > 1 * 1024 * 1024) {
      throw new BadRequestException('File size should not exceed 1MB');
    }

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, JPG, and PNG image files are allowed.');
    }
    
    const uploadDirectory = path.join(__dirname, '..','..', 'public', 'uploads');
    const uploadPath = path.join(uploadDirectory, file.originalname);

    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    const writeStream = createWriteStream(uploadPath);

    writeStream.write(file.buffer);

    writeStream.on('finish', () => {
      console.log('File saved successfully:', uploadPath);
    });

    writeStream.end();
    return {
      filename: file.filename,
      path: uploadPath,
    };
  }
}
