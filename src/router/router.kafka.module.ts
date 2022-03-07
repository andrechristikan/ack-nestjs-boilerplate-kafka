import { DynamicModule, Module } from '@nestjs/common';
import { KafkaAdminModule } from 'src/kafka/admin/kafka.admin.module';
import { KafkaProducerModule } from 'src/kafka/producer/kafka.producer.module';

@Module({})
export class RouterKafkaModule {
    static register({ env }): DynamicModule {
        if (env === 'testing') {
            return {
                module: RouterKafkaModule,
                providers: [],
                exports: [],
                controllers: [],
                imports: [],
            };
        }

        return {
            module: RouterKafkaModule,
            controllers: [],
            providers: [],
            exports: [],
            imports: [KafkaAdminModule, KafkaProducerModule],
        };
    }
}
