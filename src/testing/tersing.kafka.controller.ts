import { Controller } from '@nestjs/common';
import { MessageTopic } from 'src/kafka/kafka.decorator';

@Controller()
export class TestingKafkaController {
    @MessageTopic('nestjs.ack.success')
    async helloKafka(): Promise<void> {
        return;
    }
}
