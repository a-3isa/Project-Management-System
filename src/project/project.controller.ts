import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  @Post('/create')
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    console.log(user);
    return this.projectService.create(createProjectDto, user);
  }

  @Post('/:id/add-user/:userId')
  addUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.projectService.addUser(id, userId, user);
  }

  @Post('/:projectId/tasks')
  addTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return this.taskService.addTask(projectId, user, createTaskDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
