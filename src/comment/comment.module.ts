import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
// import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';

@Module({
  // controllers: [CommentController],
  imports: [TypeOrmModule.forFeature([Comment, Task])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
