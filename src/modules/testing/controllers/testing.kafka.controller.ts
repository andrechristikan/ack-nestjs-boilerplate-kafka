import { Controller } from '@nestjs/common';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import { IResponse } from 'src/common/response/response.interface';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.enum.constant';
import {
    MessageTopic,
    MessageValue,
} from 'src/kafka/decorators/kafka.decorator';
import { KafkaDto } from '../dtos/kafka.dto';

@Controller()
export class TestingKafkaController {
    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafka'] })
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(
        @MessageValue() value: Record<string, any>
    ): Promise<IResponse> {
        return value;
    }

    @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['helloKafkaError'] })
    @MessageTopic(ENUM_KAFKA_TOPICS.ACK_ERROR)
    async errorKafka(@MessageValue() value: KafkaDto): Promise<IResponse> {
        return value;
    }
}
