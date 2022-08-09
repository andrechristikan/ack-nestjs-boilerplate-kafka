import { Controller, Get, Optional, VERSION_NEUTRAL } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthExcludeApiKey } from 'src/common/auth/decorators/auth.api-key.decorator';
import { ENUM_KAFKA_TOPICS } from 'src/common/kafka/constants/kafka.enum.constant';
import { KafkaException } from 'src/common/kafka/error/exceptions/kafka.exception';
import { KafkaProducerService } from 'src/common/kafka/services/kafka.producer.service';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { RequestExcludeTimestamp } from 'src/common/request/decorators/request.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/response.interface';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/',
})
export class TestingController {
    constructor(
        @Optional() private readonly kafkaProducerService: KafkaProducerService
    ) {}

    @Response('test.helloKafka')
    @AuthExcludeApiKey()
    @RequestExcludeTimestamp()
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['testKafka'] })
    @Get('/kafka')
    async helloKafka(): Promise<IResponse> {
        const response = await this.kafkaProducerService.send(
            ENUM_KAFKA_TOPICS.ACK_SUCCESS,
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
    @RequestExcludeTimestamp()
    @Get('/hello/kafka-error')
    async helloKafkaError(): Promise<IResponse> {
        try {
            const response = await this.kafkaProducerService.send(
                ENUM_KAFKA_TOPICS.ACK_ERROR,
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
                },
                { raw: true }
            );

            return response;
        } catch (err: any) {
            throw new KafkaException(err);
        }
    }
}
