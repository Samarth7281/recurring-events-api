import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, CustomColumn } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, CustomColumn])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
