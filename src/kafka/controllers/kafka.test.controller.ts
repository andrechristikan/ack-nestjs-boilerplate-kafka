import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';
import { KafkaHttpException } from 'src/kafka/error/exceptions/kafka.http-exception';
import { KafkaService } from 'src/kafka/services/kafka.service';

@ApiExcludeController()
@Controller({
    version: VERSION_NEUTRAL,
    path: '/kafka',
})
export class KafkaTestController {
    constructor(private readonly kafkaService: KafkaService) {}

    @Response('test.helloKafka')
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['testKafka'] })
    @Get('/')
    async helloKafka(): Promise<IResponse> {
        const response = await this.kafkaService.produceSend(
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

        return { data: response };
    }

    @Response('test.helloKafkaError')
    @Get('/error')
    async helloKafkaError(): Promise<IResponse> {
        try {
            const response = await this.kafkaService.produceSend(
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

            return { data: response };
        } catch (err: any) {
            throw new KafkaHttpException(err);
        }
    }
}
