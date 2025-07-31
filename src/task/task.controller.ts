import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CommentService } from 'src/comment/comment.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private commentService: CommentService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(id, user);
  }

  @Post('/:taskId/comments')
  async createComment(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() author: User,
  ) {
    await this.commentService.create(taskId, createCommentDto, author);
  }

  @Get('/:taskId/comments')
  async findAllComments(@Param('taskId') taskId: string) {
    return await this.commentService.findAll(taskId);
  }
}
