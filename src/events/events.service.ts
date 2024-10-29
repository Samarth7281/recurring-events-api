import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './events.entity';
import { Repository } from 'typeorm';
import { createEventDto } from './dto/createEvent';
import { RecurrencePatternDto } from './dto/reccurencePattern';
import { LoggerService } from './logger.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly logger: LoggerService,
  ) {}

  async create(createEventDto: createEventDto): Promise<Event> {
    this.logger.log('Creating a new event');
    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }

  async getRecurringInstances(
    eventId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    this.logger.log(`Fetching recurring instances for eventId ${eventId}`);
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      this.logger.error(`Event with id ${eventId} not found`);
      throw new Error('Event not found');
    }
    const instances = this.generateInstances(event, startDate, endDate);
    return instances;
  }

  private generateInstances(event: Event, startDate: Date, endDate: Date) {
    const instances = [];
    const { recurrencePattern, exceptions } = event;

    if (!recurrencePattern) return [event];

    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(event.startTime);

    while (currentDate <= end) {
      if (this.isInDateRange(currentDate, start, end)) {
        // Check if this instance is an exception
        const exception = exceptions?.find((ex) =>
          this.isSameDate(new Date(ex.date), currentDate),
        );

        if (!exception) {
          instances.push({ ...event, startTime: currentDate });
        } else if (exception.action === 'modified') {
          instances.push({
            ...event,
            startTime: exception.newStartTime,
            endTime: exception.newEndTime,
          });
        }
      }
      currentDate = this.getNextOccurrence(currentDate, recurrencePattern);
    }
    return instances;
  }
  private getNextOccurrence(currentDate: Date, pattern: RecurrencePatternDto) {
    const nextDate = new Date(currentDate);
    switch (pattern.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + pattern.interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7 * pattern.interval);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + pattern.interval);
        break;
    }
    return nextDate;
  }

  private isInDateRange(date: Date, startDate: Date, endDate: Date) {
    return date >= startDate && date <= endDate;
  }

  private isSameDate(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
