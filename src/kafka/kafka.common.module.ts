import { DynamicModule, Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { KafkaRouterModule } from 'src/kafka/router/kafka.router.module';

@Module({})
export class KafkaCommonModule {
    static forRoot(): DynamicModule {
        const imports = [];
        if (process.env.KAFKA_CONSUMER_ENABLE === 'true') {
            imports.push(KafkaRouterModule);
        }

        return {
            module: KafkaCommonModule,
            providers: [],
            exports: [],
            controllers: [],
            imports: [KafkaModule, ...imports],
        };
    }
}
