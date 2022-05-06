import { DynamicModule, Module } from '@nestjs/common';
import { KafkaAdminModule } from './admin/kafka.admin.module';
import { KafkaProducerModule } from './producer/kafka.producer.module';

@Module({})
export class KafkaModule {
    static register(): DynamicModule {
        if (process.env.APP_MICROSERVICE_ON === 'true') {
            return {
                module: KafkaModule,
                controllers: [],
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
