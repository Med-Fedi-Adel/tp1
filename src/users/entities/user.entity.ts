import { TimeEntities } from '../../Generics/time.entities';
import { Cv } from 'src/cvs/entities/cv.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;

  @OneToMany(() => Cv, (cv: Cv) => cv.user)
  cvs: Cv[];
}
