import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    author: User,
  ) {
    const { content } = createCommentDto;
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('task not found');
    }
    const comment = this.commentRepo.create({ content, task, author });
    return await this.commentRepo.save(comment);
  }

  async findAll(taskId: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('task not found');
    }
    const comments = await this.commentRepo.find({
      where: { task },
      relations: ['author'],
    });
    console.log(comments);
    return comments;
  }
}
