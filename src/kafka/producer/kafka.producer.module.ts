import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
    ConsumerConfig,
    ConsumerSubscribeTopic,
    ProducerConfig,
} from '@nestjs/microservices/external/kafka.interface';
import { KAFKA_PRODUCER_SERVICE_NAME } from './kafka.producer.constant';
import { KafkaProducerService } from './service/kafka.producer.service';

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
                        subscribe: configService.get<ConsumerSubscribeTopic>(
                            'kafka.consumerSubscribe'
                        ),
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
