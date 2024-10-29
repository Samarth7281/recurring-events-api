import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { createEventDto } from './dto/createEvent';
import { LoggerService } from './logger.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() createEventDto: createEventDto) {
    this.logger.log('Creating a new event in controller');
    return await this.eventsService.create(createEventDto);
  }

  @Get(':id/instances')
  async getRecurringInstances(
    @Param('id') eventId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    this.logger.log(`Fetching recurring instances for event ${eventId} in controller`);
    this.logger.warn("Ensure the event exists before proceeding");
    return this.eventsService.getRecurringInstances(
      eventId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
