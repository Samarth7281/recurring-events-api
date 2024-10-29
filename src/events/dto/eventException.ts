import { Type } from "class-transformer";
import { IsArray, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
export class EventExceptionDto{
    @IsDateString()
    date: Date

    @IsIn(['cancelled','modified'])
    action: 'cancelled' | 'modified'

    @IsOptional()
    @IsDateString()
    newStartTime?: Date

    @IsOptional()
    @IsDateString()
    newEndTime?: Date
}