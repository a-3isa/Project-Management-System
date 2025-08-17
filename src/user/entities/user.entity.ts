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
@Unique(['email']) // ✅ Ensures 'username' is unique
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  otpExpiry: Date | null;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  resetTokenExpiry: Date | null;

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
