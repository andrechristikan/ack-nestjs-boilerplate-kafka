import { Module } from '@nestjs/common';
import { KafkaKafkaController } from 'src/kafka/controllers/kafka.kafka.controller';

@Module({
    providers: [],
    exports: [],
    imports: [],
    controllers: [KafkaKafkaController],
})
export class KafkaRouterModule {}
