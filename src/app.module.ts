import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CvsModule } from './cvs/cvs.module';
import { SkillsModule } from './skills/skills.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Cv } from './cvs/entities/cv.entity';
import { Skill } from './skills/entities/skill.entity';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ListenerModule } from './listener/listener.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'tp1',
      entities: ['dist/**/*.entity{.ts,.js}', User, Cv, Skill],
      synchronize: true,
      
    }),
    CvsModule,
    SkillsModule,
    UsersModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
