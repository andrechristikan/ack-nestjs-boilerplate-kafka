import { Module } from '@nestjs/common';
import { KafkaAdminModule } from './admin/kafka.admin.module';
import { KafkaProducerModule } from './producer/kafka.producer.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [KafkaAdminModule, KafkaProducerModule],
})
export class KafkaModule {}
