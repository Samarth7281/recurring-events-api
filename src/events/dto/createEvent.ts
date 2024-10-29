import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsOptional, IsString,ValidateNested } from "class-validator";
import { RecurrencePatternDto } from "./reccurencePattern";
import { EventExceptionDto } from "./eventException";

export class createEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    @IsDateString()
    @IsNotEmpty()
    endTime: Date;

    //To validate nested objects RecurrencePatternDto is a nested object
    @ValidateNested()
    @IsOptional()
    @Type(() => RecurrencePatternDto)
    recurrencePatternDto? : RecurrencePatternDto

    @ValidateNested()
    @IsOptional()
    @Type(() => EventExceptionDto)
    eventExceptionDto? : EventExceptionDto
}