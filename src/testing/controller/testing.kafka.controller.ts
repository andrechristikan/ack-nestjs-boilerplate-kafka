import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { MessageTopic } from 'src/kafka/kafka.decorator';

@Controller()
export class TestingKafkaController {
    @MessageTopic(KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(): Promise<void> {
        return;
    }

    @MessageTopic(KAFKA_TOPICS.ACK_ERROR)
    async errorKafka(): Promise<void> {
        throw new RpcException({
            statusCode: 99999,
            message: 'response.default',
        });
    }
}
