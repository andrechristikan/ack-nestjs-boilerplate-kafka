import { DynamicModule, Module } from '@nestjs/common';
import { KafkaAdminModule } from './admin/kafka.admin.module';
import { KafkaProducerModule } from './producer/kafka.producer.module';

@Module({})
export class KafkaModule {
    static register({ env }): DynamicModule {
        if (env === 'testing') {
            return {
                module: KafkaModule,
                providers: [],
                exports: [],
                controllers: [],
                imports: [],
            };
        }

        return {
            module: KafkaModule,
            controllers: [],
            providers: [],
            exports: [],
            imports: [KafkaAdminModule, KafkaProducerModule],
        };
    }
}
