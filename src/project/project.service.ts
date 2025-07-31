import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';
// import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Task } from 'src/task/entities/task.entity';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createProjectDto: CreateProjectDto, author: User) {
    // console.log(author);
    if (author.role !== 'Admin' && author.role !== 'Manager')
      throw new UnauthorizedException();
    const { title } = createProjectDto;
    const project = this.projectRepository.create({
      title,
      author,
    });
    return await this.projectRepository.save(project);
  }

  async addUser(id: string, userId: string, author: User) {
    if (author.role !== 'Admin' && author.role !== 'Manager')
      throw new UnauthorizedException();
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('project not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.projects.push(project);
    return await this.userRepository.save(user);
  }

  // async addTask(projectId: string, author: User, createTaskDto: CreateTaskDto) {
  //   if (author.role !== 'Admin' && author.role !== 'Manager')
  //     throw new UnauthorizedException();
  //   const { title, users: userIds } = createTaskDto;
  //   const users = await this.userRepository.findBy({
  //     id: In(userIds),
  //   });
  //   const project = await this.projectRepository.findOne({
  //     where: { id: projectId },
  //   });
  //   if (!project) {
  //     throw new NotFoundException('project not found');
  //   }
  //   const task = this.taskRepository.create({
  //     title,
  //     author,
  //     project,
  //     assignedUsers: users,
  //   });
  //   return await this.taskRepository.save(task);
  // }

  findAll() {
    return this.projectRepository.find({ relations: ['users', 'author'] });
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'author'],
    });
    if (!project) throw new NotFoundException('project not found');
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('project not found');
    }
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string) {
    await this.projectRepository.delete(id);
  }
}
