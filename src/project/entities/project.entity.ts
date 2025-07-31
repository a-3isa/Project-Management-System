import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Task, (task) => task.project, {
    eager: true,
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @ManyToMany(() => User, (user) => user.projects, {
    eager: false,
    onDelete: 'CASCADE',
  })
  users: User[];

  @ManyToOne(() => User, (user) => user.createdProjects, {
    eager: false,
    onDelete: 'CASCADE',
  })
  author: User;
}
