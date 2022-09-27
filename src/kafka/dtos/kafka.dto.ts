import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsMongoId,
    IsBoolean,
    IsNumber,
    IsDate,
} from 'class-validator';

export class KafkaDto {
    @IsString()
    @IsNotEmpty()
    readonly test: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    readonly testNumber: number;

    @IsBoolean()
    @IsNotEmpty()
    readonly testBoolean: boolean;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    readonly testDate: Date;

    @IsMongoId()
    @IsNotEmpty()
    @Type(() => String)
    readonly testObjectId: string;
}
