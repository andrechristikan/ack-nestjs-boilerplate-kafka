import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { MessageTopic, MessageValue } from 'src/kafka/kafka.decorator';
import { ENUM_LOGGER_ACTION } from 'src/logger/logger.constant';
import { Logger } from 'src/logger/logger.decorator';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { IResponse } from 'src/utils/response/response.interface';

@Controller()
export class TestingKafkaController {
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafka'] })
    @ErrorMeta(TestingKafkaController.name, 'helloKafka')
    @MessageTopic(KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(
        @MessageValue() value: Record<string, any> // can change to dto class
    ): Promise<IResponse> {
        return value;
    }

    @ErrorMeta(TestingKafkaController.name, 'errorKafka')
    @MessageTopic(KAFKA_TOPICS.ACK_ERROR)
    async errorKafka(): Promise<void> {
        throw new RpcException({
            statusCode: 9999,
            message: 'response.default',
        });
    }
}
