import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Task]),
    AuthModule,
    TaskModule,
  ],

  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
