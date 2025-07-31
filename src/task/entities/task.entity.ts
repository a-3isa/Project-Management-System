import { Comment } from 'src/comment/entities/comment.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Project, (project) => project.tasks, { eager: false })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.task, { eager: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user: User;

  @ManyToOne(() => User, (user) => user.createdTasks, { eager: false })
  author: User;
}
