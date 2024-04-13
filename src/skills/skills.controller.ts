import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private service: SkillsService) {}

  @Get()
  async allSkills() {
    return await this.service.getSkills();
  }
  @Post()
  async AddSkill(@Body() skill: CreateSkillDto) {
    return await this.service.createSkill(skill);
  }
  @Get(':id')
  async getSkillByid(@Param('id', ParseIntPipe) id) {
    return await this.service.getSkillById(id);
  }
  @Patch(':id')
  async updateSkill(
    @Param('id', ParseIntPipe) id,
    @Body() updateskill: UpdateSkillDto,
  ) {
    return await this.service.updateSkill(id, updateskill);
  }
  @Delete(':id')
  async deleteSkill(@Param('id') id) {
    return this.service.deleteSkill(id);
  }
}
