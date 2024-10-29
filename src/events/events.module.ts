import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events.entity';
import { LoggerService } from './logger.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Event])
  ],
  providers: [EventsService,LoggerService],
  controllers: [EventsController]
})
export class EventsModule {}
