import { TimeEntities } from '../../Generics/time.entities';
import { Cv } from '../../cvs/entities/cv.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Cv, (cv: Cv) => cv.user)
  cvs: Cv[];
}
