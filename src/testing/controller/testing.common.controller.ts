import {
    Controller,
    Get,
    InternalServerErrorException,
    Optional,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthExcludeApiKey } from 'src/auth/auth.decorator';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { KafkaProducerService } from 'src/kafka/producer/service/kafka.producer.service';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';
import { Logger } from 'src/logger/logger.decorator';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { HelperService } from 'src/utils/helper/service/helper.service';
import {
    RequestTimezone,
    RequestUserAgent,
} from 'src/utils/request/request.decorator';
import {
    Response,
    ResponseTimeout,
} from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { IResult } from 'ua-parser-js';

@Controller({
    version: VERSION_NEUTRAL,
})
export class TestingCommonController {
    constructor(
        @Optional() private readonly kafkaProducerService: KafkaProducerService,
        private readonly helperDateService: HelperDateService,
        private readonly helperService: HelperService
    ) {}

    @Response('test.hello')
    @AuthExcludeApiKey()
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['test'] })
    @Get('/hello')
    async hello(
        @RequestUserAgent() userAgent: IResult,
        @RequestTimezone() timezone: string
    ): Promise<IResponse> {
        const newDate = this.helperDateService.create({
            timezone: timezone,
        });
        return {
            userAgent,
            date: newDate,
            format: this.helperDateService.format(newDate, {
                timezone: timezone,
            }),
            timestamp: this.helperDateService.timestamp({
                date: newDate,
                timezone: timezone,
            }),
        };
    }

    @Response('test.helloTimeout')
    @AuthExcludeApiKey()
    @ResponseTimeout('10s')
    @ErrorMeta(TestingCommonController.name, 'helloTimeoutCustom')
    @Get('/hello/timeout')
    async helloTimeout(): Promise<IResponse> {
        await this.helperService.delay(60000);

        return;
    }

    @Response('test.helloKafka')
    @AuthExcludeApiKey()
    @ErrorMeta(TestingCommonController.name, 'helloKafka')
    @Get('/hello/kafka')
    async helloKafka(): Promise<IResponse> {
        const response = await this.kafkaProducerService.send(
            KAFKA_TOPICS.ACK_SUCCESS,
            {
                test: 'test',
                testNumber: [],
                testBoolean: false,
                testObject: {
                    inObject: 'adsasda',
                },
                testArray: ['2', '3', 123, false],
                testArrayOfObject: [
                    {
                        test1: 'test1',
                    },
                    {
                        test2: 'test3',
                    },
                ],
                testDate: new Date(),
                testObjectId: new Types.ObjectId(),
            }
        );

        return response;
    }

    @Response('test.helloKafkaError')
    @AuthExcludeApiKey()
    @ErrorMeta(TestingCommonController.name, 'helloKafkaError')
    @Get('/hello/kafka-error')
    async helloKafkaError(): Promise<IResponse> {
        try {
            const response = await this.kafkaProducerService.send(
                KAFKA_TOPICS.ACK_ERROR,
                {
                    testNumber: [],
                    testBoolean: 'false',
                    testObject: {
                        inObject: 'adsasda',
                    },
                    testArray: ['2', '3', 123, false],
                    testArrayOfObject: [
                        {
                            test1: 'test1',
                        },
                        {
                            test2: 'test3',
                        },
                    ],
                    testDate: new Date(),
                    testObjectId: 12312312,
                }
            );

            return response;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
