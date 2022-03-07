import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
    KAFKA_PRODUCER_INSYNC_SERVICE_NAME,
    KAFKA_PRODUCER_LEADER_SYNC_SERVICE_NAME,
} from './kafka.producer.constant';
import { KafkaProducerService } from './kafka.producer.service';

@Global()
@Module({
    providers: [KafkaProducerService],
    exports: [KafkaProducerService],
    controllers: [],
    imports: [
        ClientsModule.registerAsync([
            {
                name: KAFKA_PRODUCER_INSYNC_SERVICE_NAME,
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
                            allowAutoTopicCreation: false,
                            retry: {
                                retries:
                                    configService.get<number>('kafka.retries'),
                            },
                        },
                        send: {
                            acks: -1,
                        },
                    },
                }),
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: KAFKA_PRODUCER_LEADER_SYNC_SERVICE_NAME,
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
                            allowAutoTopicCreation: false,
                            retry: {
                                retries:
                                    configService.get<number>('kafka.retries'),
                            },
                        },
                        send: {
                            acks: 1,
                        },
                    },
                }),
            },
        ]),
    ],
})
export class KafkaProducerModule {}
