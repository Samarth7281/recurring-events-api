import { Type } from "class-transformer";
import { IsArray,  IsIn,  IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { EndConditionDto } from "./endCondition";

export class RecurrencePatternDto{
    @IsIn(['daily' , 'weekly' , 'monthly' , 'yearly'])
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'

    @IsNotEmpty()
    interval: number

    @IsArray()
    @IsOptional()
    daysOfWeek?: string[]
    
    //The recurring ends after the number of Occurences is completed OR the end date is reached
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => EndConditionDto)
    endCondition: EndConditionDto
}