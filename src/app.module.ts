import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomColumn, Task } from './tasks/task.entity';
import { Event } from './events/events.entity';
import { EventsModule } from './events/events.module';
import { LoggerService } from './events/logger.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'tasks_db',
    entities: [Task,CustomColumn,Event],
    synchronize: true, // Use synchronize only in development, not in production
  }),TasksModule, EventsModule],
  controllers: [AppController],
  providers: [AppService,LoggerService],
})
export class AppModule {}
