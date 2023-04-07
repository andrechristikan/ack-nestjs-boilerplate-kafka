import { Controller } from '@nestjs/common';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';
import {
    MessageCommitOffsetInFirstRunning,
    MessageTopic,
    MessageValue,
} from 'src/kafka/decorators/kafka.decorator';
import { KafkaDto } from 'src/kafka/dtos/kafka.dto';
import { IKafkaResponse } from 'src/kafka/interfaces/kafka.interface';

@Controller()
export class KafkaController {
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafka'] })
    @MessageCommitOffsetInFirstRunning()
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(
        @MessageValue() value: Record<string, any>
    ): Promise<IKafkaResponse> {
        return value;
    }

    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafkaError'] })
    @MessageCommitOffsetInFirstRunning()
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_ERROR)
    async errorKafka(@MessageValue() value: KafkaDto): Promise<IKafkaResponse> {
        return value;
    }
}
