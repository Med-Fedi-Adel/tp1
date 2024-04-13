import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}
  //async addSkillparDonnéesFictives() {
  //const s = randSkill();
  //const skill = new CreateSkillDto(s);
  //return await this.skillRepository.save(skill);
  //}
  async add(skill: CreateSkillDto) {
    return await this.skillRepository.save(skill);
  }
  async createSkill(skill: CreateSkillDto): Promise<Skill> {
    return await this.skillRepository.save(skill);
  }
  async getSkills(): Promise<Skill[]> {
    return this.skillRepository.find();
  }
  async getSkillById(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOneById(id);
    if (!skill) {
      throw new NotFoundException(`Le skill d'id ${id} n'existe pas`);
    }
    return skill;
  }
  async updateSkill(id: number, updateskill: UpdateSkillDto): Promise<Skill> {
    const newskill = await this.skillRepository.preload({
      id,
      ...updateskill,
    });
    if (!newskill) {
      throw new NotFoundException(`Le skill d'id ${id} n'existe pas`);
    }
    return await this.skillRepository.save(newskill);
  }
  async deleteSkill(id: number) {
    return await this.skillRepository.delete(id);
  }
}
