import { Controller } from '@nestjs/common';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { MessageTopic } from 'src/kafka/kafka.decorator';

@Controller()
export class TestingKafkaController {
    @MessageTopic(KAFKA_TOPICS.ACK_SUCCESS)
    async helloKafka(): Promise<void> {
        return;
    }
}
