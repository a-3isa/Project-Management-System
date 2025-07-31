import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addTask(projectId: string, author: User, createTaskDto: CreateTaskDto) {
    if (author.role !== 'Admin' && author.role !== 'Manager')
      throw new UnauthorizedException();
    const { title, userId } = createTaskDto;
    // console.log(userId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    // console.log(user);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('project not found');
    }
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const task = this.taskRepository.create({
      title,
      author,
      project,
      user,
    });
    // console.log(title);
    // console.log('||||||||||||||');
    // console.log(author)
    // console.log('||||||||||||||');
    // console.log(project);
    // console.log('||||||||||||||');
    // console.log(users);
    // console.log('||||||||||||||');
    // console.log(task);
    // console.log('||||||||||||||');
    return await this.taskRepository.save(task);
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'author'],
    });
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, author: User) {
    if (author.role !== 'Admin' && author.role !== 'Manager')
      throw new UnauthorizedException();
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('task not found');
    }
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  remove(id: string, author: User) {
    if (author.role !== 'Admin' && author.role !== 'Manager')
      throw new UnauthorizedException();
    return this.taskRepository.delete(id);
  }
}
