import {
  Controller,
  Post,
  Query,
  Get,
  Body,
  Delete,
  ParseArrayPipe,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDto,customColumnDto } from './dto/dto';
import { CustomColumn, Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  // POST /tasks?date=YYYY-MM-DD
  @Post()
  async addTask(
    @Query('date') date: string,
    @Body() createTaskDto: createTaskDto,
  ): Promise<Task[]> {
    console.log(createTaskDto);
    return this.taskService.addTask(date, createTaskDto);
  }

  // GET /tasks?date=YYYY-MM-DD
  @Get()
  async getTasks(@Query('date') date: string): Promise<Task[]> {
    return this.taskService.getTask(date);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Query('date') date: string,
    @Body() createTaskDto: createTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(date,id,createTaskDto);
  }

  // Delete multiple tasks
  @Delete()
  async deleteTasks(@Query('date') date: string,
    @Body('ids', new ParseArrayPipe({ items: Number, optional: false }))
    ids: number[],
  ): Promise<void> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('The IDs array must not be empty');
    }
    return this.taskService.deleteTasks(date,ids);
  }

  // Add a custom column to a task
  @Post('columns')
  async addCustomColumn(
    @Body() customColumnDto: customColumnDto,
  ): Promise<CustomColumn> {
    return this.taskService.addCustomColumn(customColumnDto);
  }

  // GET /columns (Get all custom columns)
  @Get('columns')
  async getCustomColumns(): Promise<CustomColumn[]> {
    return this.taskService.getCustomColumns();
  }

  //Add values to columns
  @Put('columns/:id')
  async addValuesToColumn(@Param('id') id: number,@Body('newValues',new ParseArrayPipe({items:String,optional: false})) newValues: string[]): Promise<CustomColumn>{
    return this.taskService.addValuesToColumn(id,newValues)
  }

  //Delete Values from Column
  @Delete('columns/:id')
  async deleteColumns(@Param('id') id: number): Promise<CustomColumn>{
    return this.taskService.deleteColumns(id)
  }

  //Delete Values from Column
  @Delete('columns/:id/values')
  async deleteValuesFromColumns(@Param('id') id: number,@Body('valuesToBeDeleted',new ParseArrayPipe({items:String,optional: false})) valuesToBeDeleted: string[]): Promise<CustomColumn>{
    return this.taskService.deleteValuesFromColumns(id,valuesToBeDeleted)
  }
}
