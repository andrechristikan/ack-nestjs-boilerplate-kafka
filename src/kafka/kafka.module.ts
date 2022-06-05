import { DynamicModule, Module } from '@nestjs/common';
import { TestingKafkaController } from 'src/testing/controller/testing.kafka.controller';
import { KafkaAdminModule } from './admin/kafka.admin.module';
import { KafkaProducerModule } from './producer/kafka.producer.module';

@Module({})
export class KafkaModule {
    static register(): DynamicModule {
        if (process.env.APP_MICROSERVICE_ON === 'true') {
            return {
                module: KafkaModule,
                controllers: [TestingKafkaController],
                providers: [],
                exports: [],
                imports: [KafkaAdminModule, KafkaProducerModule],
            };
        }

        return {
            module: KafkaModule,
            providers: [],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
