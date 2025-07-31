import { Comment } from 'src/comment/entities/comment.entity';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username']) // ✅ Ensures 'username' is unique
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: string;

  @ManyToMany(() => Project, (project) => project.users, {
    eager: true,
  })
  @JoinTable()
  projects: Project[];

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
  @OneToMany(() => Comment, (comment) => comment.author, { eager: true })
  comments: Comment[];

  @OneToMany(() => Project, (project) => project.author, { eager: true })
  createdProjects: Project[];

  @OneToMany(() => Task, (task) => task.author, { eager: true })
  createdTasks: Task[];
}
