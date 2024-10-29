import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RecurrencePatternDto } from './dto/reccurencePattern';
import { EventExceptionDto } from './dto/eventException';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column('json', { nullable: true })
  recurrencePattern: RecurrencePatternDto;

  @Column('json', { nullable: true })
  exceptions: EventExceptionDto[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
