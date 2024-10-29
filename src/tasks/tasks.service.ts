import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomColumn, Task } from './task.entity';
import { In, Repository } from 'typeorm';
import { createTaskDto, customColumnDto } from './dto/dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(CustomColumn)
    private readonly customColumnRepository: Repository<CustomColumn>,
  ) {}

  // Add a new task for a specific date
  async addTask(date: string, createTaskDto: createTaskDto): Promise<Task[]> {
    const newTask = this.taskRepository.create({
      date,
      label: createTaskDto.label,
      value: createTaskDto.value,
    });
    await this.taskRepository.save(newTask);
    return this.taskRepository.find({ where: { date } });
  }

  //Get tasks for a specific date
  async getTask(date: string): Promise<Task[]> {
    return await this.taskRepository.find({ where: { date } });
  }

  // Update an existing task by its ID
  async updateTask(
    date: string,
    id: number,
    createTaskDto: createTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { date, id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // Update the task's properties
    task.label = createTaskDto.label;
    task.value = createTaskDto.value;

    await this.taskRepository.save(task);
    return task;
  }

  // Delete multiple tasks by an array of IDs
  async deleteTasks(date: string, ids: number[]): Promise<void> {
    const result = await this.taskRepository.delete({ id: In(ids) });
    if (result.affected === 0)
      throw new NotFoundException(`The task with id ${ids} does not exist`);
  }

  // Add or update custom columns for a task
  async addCustomColumn(
    customColumnDto: customColumnDto,
  ): Promise<CustomColumn> {
    console.log(customColumnDto);
    const newColumn = this.customColumnRepository.create({
      label: customColumnDto.label,
      value: customColumnDto.value,
    });

    return await this.customColumnRepository.save(newColumn);
  }

  // Get custom columns
  async getCustomColumns(): Promise<CustomColumn[]> {
    return await this.customColumnRepository.find();
  }

  //Add values to Columns
  async addValuesToColumn(
    columnId: number,
    newValues: string[],
  ): Promise<CustomColumn> {
    const column = await this.customColumnRepository.findOne({
      where: { id: columnId },
    });
    if (!column) {
      throw new Error(`The column of this ${columnId} does not exist`);
    }
    column.value = [...column.value, ...newValues];
    return await this.customColumnRepository.save(column);
  }

  //Delete Columns
  async deleteColumns(columnId: number): Promise<CustomColumn> {
    const column = await this.customColumnRepository.findOne({
      where: { id: columnId },
    });
    if (!column) {
      throw new Error(`The column of this ${columnId} does not exist`);
    }
    return await this.customColumnRepository.remove(column);
  }

  //Delete Values from Columns
  async deleteValuesFromColumns(
    columnId: number,
    valuesToBeDeleted: string[],
  ): Promise<CustomColumn> {
    const column = await this.customColumnRepository.findOne({
      where: { id: columnId },
    });
    if (!column) {
      throw new Error(`The column of this ${columnId} does not exist`);
    }
    column.value = column.value.filter(
      (value) => !valuesToBeDeleted.includes(value),
    );
    return this.customColumnRepository.save(column);
  }
}
