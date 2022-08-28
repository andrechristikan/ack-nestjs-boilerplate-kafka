import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
    ConsumerConfig,
    ConsumerSubscribeTopics,
    ProducerConfig,
} from 'kafkajs';
import {
    KAFKA_PRODUCER_SERVICE_NAME,
    KAFKA_TOPICS_REPLY,
} from './constants/kafka.constant';
import { KafkaRouterModule } from './router/kafka.router.module';
import { KafkaAdminService } from './services/kafka.admin.service';
import { KafkaProducerService } from './services/kafka.producer.service';

@Global()
@Module({
    providers: [KafkaProducerService],
    exports: [KafkaProducerService],
    controllers: [],
    imports: [
        ClientsModule.registerAsync([
            {
                name: KAFKA_PRODUCER_SERVICE_NAME,
                inject: [ConfigService],
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId:
                                configService.get<string>('kafka.clientId'),
                            brokers:
                                configService.get<string[]>('kafka.brokers'),
                        },
                        producer:
                            configService.get<ProducerConfig>('kafka.producer'),
                        consumer:
                            configService.get<ConsumerConfig>('kafka.consumer'),
                        subscribe: {
                            topics: KAFKA_TOPICS_REPLY,
                            ...configService.get<ConsumerSubscribeTopics>(
                                'kafka.consumerSubscribe'
                            ),
                        },
                        send: {
                            timeout: configService.get<number>(
                                'kafka.producerSend.timeout'
                            ),
                            acks: -1,
                        },
                    },
                }),
            },
        ]),
    ],
})
export class KafkaProducerModule {}

@Module({})
export class KafkaModule {
    static register(): DynamicModule {
        if (process.env.APP_KAFKA_ON === 'true') {
            return {
                module: KafkaModule,
                controllers: [],
                providers: [KafkaAdminService],
                exports: [],
                imports: [KafkaRouterModule, KafkaProducerModule],
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
