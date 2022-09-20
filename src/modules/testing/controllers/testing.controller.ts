import { Controller, Get, Optional, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { RequestExcludeTimestamp } from 'src/common/request/decorators/request.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';
import { KafkaException } from 'src/kafka/error/exceptions/kafka.exception';
import { KafkaProducerService } from 'src/kafka/services/kafka.producer.service';

@ApiExcludeController()
@Controller({
    version: VERSION_NEUTRAL,
    path: '/testing',
})
export class TestingController {
    constructor(
        @Optional() private readonly kafkaProducerService: KafkaProducerService
    ) {}

    @Response('test.helloKafka')
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
