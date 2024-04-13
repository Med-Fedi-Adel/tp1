import { TimeEntities } from '../../Generics/time.entities';
import { Cv } from 'src/cvs/entities/cv.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skill')
export class Skill extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  designation: string;
  @ManyToMany(() => Cv, (cvs) => cvs.skills)
  cvs: Cv[];
}
