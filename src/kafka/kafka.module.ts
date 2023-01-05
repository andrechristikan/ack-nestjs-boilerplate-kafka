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
                        producer: {
                            ...configService.get<ProducerConfig>(
                                'kafka.producer'
                            ),
                            allowAutoTopicCreation: configService.get<boolean>(
                                'kafka.allowAutoTopicCreation'
                            ),
                        },
                        consumer: {
                            ...configService.get<ConsumerConfig>(
                                'kafka.consumer'
                            ),
                            allowAutoTopicCreation: configService.get<boolean>(
                                'kafka.allowAutoTopicCreation'
                            ),
                        },
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

@Module({
    providers: [KafkaAdminService],
    exports: [KafkaAdminService],
    controllers: [],
    imports: [],
})
export class KafkaAdminModule {}

@Module({})
export class KafkaModule {
    static register(): DynamicModule {
        const imports = [];
        if (process.env.KAFKA_CONSUMER_ENABLE === 'true') {
            imports.push(KafkaRouterModule);
        }

        if (process.env.KAFKA_PRODUCER_ENABLE === 'true') {
            imports.push(KafkaProducerModule);
        }

        return {
            module: KafkaModule,
            providers: [],
            exports: [],
            controllers: [],
            imports,
        };
    }
}
