import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class EndConditionDto {
  @IsIn(['numberOfOccurrences', 'endDate'])
  type: 'numberOfOccurrences' | 'endDate';

  @ValidateIf((o) => o.type === 'numberOfOccurrences')
  @IsInt()
  @IsOptional()
  occurrences?: number;

  @ValidateIf((o) => o.type === 'endDate')
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
