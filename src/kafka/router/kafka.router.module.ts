import { Module } from '@nestjs/common';
import { TestingKafkaController } from 'src/modules/testing/controllers/testing.kafka.controller';

@Module({
    providers: [],
    exports: [],
    imports: [],
    controllers: [TestingKafkaController],
})
export class KafkaRoutesModule {}
