import { Module } from '@nestjs/common';
import { KafkaController } from 'src/modules/testing/controllers/testing.kafka.controller';

@Module({
    providers: [],
    exports: [],
    imports: [],
    controllers: [KafkaController],
})
export class KafkaRoutesModule {}
