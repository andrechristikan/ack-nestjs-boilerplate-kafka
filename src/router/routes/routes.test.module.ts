import { Module } from '@nestjs/common';
import { KafkaTestController } from 'src/kafka/controllers/kafka.test.controller';

@Module({
    controllers: [KafkaTestController],
    providers: [],
    exports: [],
    imports: [],
})
export class RoutesTestModule {}
