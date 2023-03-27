import { Controller } from '@nestjs/common';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';
import {
    MessageCommitOffsetInFirstRunning,
    MessageTopic,
    MessageValue,
} from 'src/kafka/decorators/kafka.decorator';
import { KafkaDto } from 'src/kafka/dtos/kafka.dto';

@Controller()
export class KafkaController {
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafka'] })
    @MessageCommitOffsetInFirstRunning()
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(
        @MessageValue() value: Record<string, any>
    ): Promise<IResponse> {
        return value;
    }

    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafkaError'] })
    @MessageCommitOffsetInFirstRunning()
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_ERROR)
    async errorKafka(@MessageValue() value: KafkaDto): Promise<IResponse> {
        return value;
    }
}
